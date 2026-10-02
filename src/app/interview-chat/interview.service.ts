import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { INTERVIEW_API_BASE_URL } from './interview-api.config';
import { LanguageService } from '../i18n/language.service';

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

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private http = inject(HttpClient);
  private language = inject(LanguageService);
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
      return { kind: 'error', httpStatus: 200, text: this.messages().empty };
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
    const messages = this.messages();
    if (!(error instanceof HttpErrorResponse)) {
      return { kind: 'error', httpStatus: 0, text: messages.generic };
    }
    const serverMessage = this.language.language() === 'pt' ? this.extractMessage(error.error) : undefined;
    switch (error.status) {
      case 0:
        return { kind: 'error', httpStatus: 0, text: messages.network };
      case 400:
        return { kind: 'error', httpStatus: 400, text: serverMessage ?? messages.invalid };
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
        return { kind: 'error', httpStatus: 503, text: serverMessage ?? messages.unavailable };
      default:
        return { kind: 'error', httpStatus: error.status, text: serverMessage ?? messages.generic };
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
    const messages = this.messages();
    return retryAfterSeconds ? messages.rateLimitIn(retryAfterSeconds) : messages.rateLimit;
  }

  private messages() {
    return this.language.t().chat.errors;
  }
}
