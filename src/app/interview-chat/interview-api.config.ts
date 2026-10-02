import { InjectionToken } from '@angular/core';

export const INTERVIEW_API_BASE_URL = new InjectionToken<string>('INTERVIEW_API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://portfolio-interview-api-production.up.railway.app'
});
