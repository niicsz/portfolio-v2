import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { INTERVIEW_API_BASE_URL } from './interview-api.config';
import { InterviewResult, InterviewService } from './interview.service';
import { LanguageService } from '../i18n/language.service';

describe('InterviewService', () => {
  const baseUrl = 'https://api.example.test/';
  const endpoint = 'https://api.example.test/api/interview/questions';
  let service: InterviewService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: INTERVIEW_API_BASE_URL, useValue: baseUrl }
      ]
    });
    service = TestBed.inject(InterviewService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  function ask(question: string): InterviewResult[] {
    const results: InterviewResult[] = [];
    service.ask(question).subscribe((result) => results.push(result));
    return results;
  }

  it('posts only the trimmed question to the configured endpoint', () => {
    ask('  Onde ele estuda?  ');
    const request = http.expectOne(endpoint);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ question: 'Onde ele estuda?' });
    request.flush({ status: 'ANSWERED', answer: 'ok', sources: [] });
  });

  it('maps ANSWERED with sources', () => {
    const results = ask('Onde ele estuda?');
    http.expectOne(endpoint).flush({ status: 'ANSWERED', answer: ' Na USP. ', sources: ['Educação', ''] });
    expect(results).toEqual([{ kind: 'answer', status: 'ANSWERED', text: 'Na USP.', sources: ['Educação'] }]);
  });

  it.each(['OUT_OF_SCOPE', 'REJECTED'])('maps %s and drops sources', (status) => {
    const results = ask('Qual a receita de bolo?');
    http.expectOne(endpoint).flush({ status, answer: 'Não posso responder.', sources: ['Projetos'] });
    expect(results).toEqual([{ kind: 'answer', status, text: 'Não posso responder.', sources: [] }]);
  });

  it('treats an empty answer as an error', () => {
    const results = ask('Onde ele estuda?');
    http.expectOne(endpoint).flush({ status: 'ANSWERED', answer: '   ', sources: [] });
    expect(results[0].kind).toBe('error');
  });

  it('uses the server message for 400', () => {
    const results = ask('abc');
    http
      .expectOne(endpoint)
      .flush({ status: 400, message: 'A pergunta deve ter entre 3 e 500 caracteres', timestamp: 'now' }, { status: 400, statusText: 'Bad Request' });
    expect(results).toEqual([{ kind: 'error', httpStatus: 400, text: 'A pergunta deve ter entre 3 e 500 caracteres' }]);
  });

  it('falls back to a friendly message for 400 without body', () => {
    const results = ask('abc');
    http.expectOne(endpoint).flush(null, { status: 400, statusText: 'Bad Request' });
    expect(results[0]).toMatchObject({ kind: 'error', httpStatus: 400 });
    expect(results[0].text).toContain('entre 3 e 500');
  });

  it('reads Retry-After on 429 when there is no message', () => {
    const results = ask('Onde ele estuda?');
    http
      .expectOne(endpoint)
      .flush(null, { status: 429, statusText: 'Too Many Requests', headers: { 'Retry-After': '42' } });
    expect(results).toEqual([
      {
        kind: 'error',
        httpStatus: 429,
        text: 'Muitas perguntas em pouco tempo. Tente novamente em 42 segundos.',
        retryAfterSeconds: 42
      }
    ]);
  });

  it('handles 429 without Retry-After', () => {
    const results = ask('Onde ele estuda?');
    http.expectOne(endpoint).flush(null, { status: 429, statusText: 'Too Many Requests' });
    expect(results[0]).toMatchObject({ kind: 'error', httpStatus: 429, retryAfterSeconds: undefined });
    expect(results[0].text).toContain('Aguarde');
  });

  it('prefers the server message on 503', () => {
    const results = ask('Onde ele estuda?');
    http
      .expectOne(endpoint)
      .flush({ status: 503, message: 'Modelo indisponível', timestamp: 'now' }, { status: 503, statusText: 'Service Unavailable' });
    expect(results).toEqual([{ kind: 'error', httpStatus: 503, text: 'Modelo indisponível' }]);
  });

  it('falls back on 503 without body', () => {
    const results = ask('Onde ele estuda?');
    http.expectOne(endpoint).flush('', { status: 503, statusText: 'Service Unavailable' });
    expect(results[0].text).toContain('temporariamente indisponível');
  });

  it('maps network or CORS failures to a connection message', () => {
    const results = ask('Onde ele estuda?');
    http.expectOne(endpoint).error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    expect(results[0]).toMatchObject({ kind: 'error', httpStatus: 0 });
    expect(results[0].text).toContain('Não foi possível conectar');
  });

  it('maps unexpected statuses to a generic message', () => {
    const results = ask('Onde ele estuda?');
    http.expectOne(endpoint).flush('boom', { status: 500, statusText: 'Server Error' });
    expect(results[0]).toMatchObject({ kind: 'error', httpStatus: 500 });
    expect(results[0].text).toContain('Algo deu errado');
  });

  it('uses English fallbacks instead of the Portuguese server message in English mode', () => {
    TestBed.inject(LanguageService).set('en');

    const results = ask('Where does he study?');
    http
      .expectOne(endpoint)
      .flush({ status: 503, message: 'O assistente está indisponível no momento.' }, { status: 503, statusText: 'Service Unavailable' });

    expect(results).toEqual([
      { kind: 'error', httpStatus: 503, text: 'The assistant is temporarily unavailable. Please try again later.' }
    ]);
  });
});
