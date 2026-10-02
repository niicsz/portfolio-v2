import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { INTERVIEW_API_BASE_URL } from './interview-api.config';

export type InterviewStatus = 'ANSWERED' | 'OUT_OF_SCOPE' | 'REJECTED';

export interface InterviewApiResponse {
  status: InterviewStatus;
  answer: string;
  sources: string[];
}

export type InterviewResult =
  | { kind: 'answer'; status: InterviewStatus; text: string; sources: string[] }
  | { kind: 'error'; httpStatus: number; text: string; retryAfterSeconds?: number };

export const MIN_QUESTION_LENGTH = 3;
export const MAX_QUESTION_LENGTH = 500;

const FALLBACK_MESSAGES = {
  network: 'Não foi possível conectar ao assistente agora. Verifique sua conexão e tente novamente em instantes.',
  invalid: `Não consegui entender a pergunta. Ela precisa ter entre ${MIN_QUESTION_LENGTH} e ${MAX_QUESTION_LENGTH} caracteres.`,
  unavailable: 'O assistente está temporariamente indisponível. Tente novamente mais tarde.',
  generic: 'Algo deu errado ao buscar a resposta. Tente novamente em instantes.',
  empty: 'Não recebi uma resposta válida do assistente. Tente novamente.'
};

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private http = inject(HttpClient);
  private baseUrl = inject(INTERVIEW_API_BASE_URL).replace(/\/+$/, '');

  ask(question: string): Observable<InterviewResult> {
    return this.http
      .post<InterviewApiResponse>(`${this.baseUrl}/api/interview/questions`, { question: question.trim() })
      .pipe(
        map((response) => this.toAnswer(response)),
        catchError((error: unknown) => of(this.toError(error)))
      );
  }

  private toAnswer(response: InterviewApiResponse | null): InterviewResult {
    const text = typeof response?.answer === 'string' ? response.answer.trim() : '';
    if (!response || !text) {
      return { kind: 'error', httpStatus: 200, text: FALLBACK_MESSAGES.empty };
    }
    const status: InterviewStatus = ['ANSWERED', 'OUT_OF_SCOPE', 'REJECTED'].includes(response.status)
      ? response.status
      : 'OUT_OF_SCOPE';
    const sources =
      status === 'ANSWERED' && Array.isArray(response.sources)
        ? response.sources.filter((source): source is string => typeof source === 'string' && source.trim() !== '')
        : [];
    return { kind: 'answer', status, text, sources };
  }

  private toError(error: unknown): InterviewResult {
    if (!(error instanceof HttpErrorResponse)) {
      return { kind: 'error', httpStatus: 0, text: FALLBACK_MESSAGES.generic };
    }
    const serverMessage = this.extractMessage(error.error);
    switch (error.status) {
      case 0:
        return { kind: 'error', httpStatus: 0, text: FALLBACK_MESSAGES.network };
      case 400:
        return { kind: 'error', httpStatus: 400, text: serverMessage ?? FALLBACK_MESSAGES.invalid };
      case 429: {
        const retryAfterSeconds = this.parseRetryAfter(error.headers?.get('Retry-After'));
        return {
          kind: 'error',
          httpStatus: 429,
          text: serverMessage ?? this.rateLimitMessage(retryAfterSeconds),
          retryAfterSeconds
        };
      }
      case 503:
        return { kind: 'error', httpStatus: 503, text: serverMessage ?? FALLBACK_MESSAGES.unavailable };
      default:
        return { kind: 'error', httpStatus: error.status, text: serverMessage ?? FALLBACK_MESSAGES.generic };
    }
  }

  private extractMessage(body: unknown): string | undefined {
    if (body && typeof body === 'object' && 'message' in body) {
      const message = (body as { message: unknown }).message;
      if (typeof message === 'string' && message.trim() !== '') {
        return message.trim();
      }
    }
    return undefined;
  }

  private parseRetryAfter(value: string | null | undefined): number | undefined {
    if (!value) {
      return undefined;
    }
    const seconds = Number.parseInt(value, 10);
    return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined;
  }

  private rateLimitMessage(retryAfterSeconds?: number): string {
    if (retryAfterSeconds) {
      const unit = retryAfterSeconds === 1 ? 'segundo' : 'segundos';
      return `Muitas perguntas em pouco tempo. Tente novamente em ${retryAfterSeconds} ${unit}.`;
    }
    return 'Muitas perguntas em pouco tempo. Aguarde um pouco e tente novamente.';
  }
}
