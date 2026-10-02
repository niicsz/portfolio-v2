import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  afterEach(() => localStorage.clear());

  it('defaults to Brazilian Portuguese', () => {
    const service = TestBed.inject(LanguageService);

    expect(service.language()).toBe('pt');
    expect(service.t().nav.about).toBe('Sobre');
    expect(document.documentElement.lang).toBe('pt-BR');
  });

  it('switches to English, persists the choice and updates the html lang', () => {
    const service = TestBed.inject(LanguageService);

    service.toggle();

    expect(service.language()).toBe('en');
    expect(service.t().nav.about).toBe('About');
    expect(localStorage.getItem('lang')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('restores the stored language', () => {
    localStorage.setItem('lang', 'en');

    expect(TestBed.inject(LanguageService).language()).toBe('en');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem('lang', 'fr');

    expect(TestBed.inject(LanguageService).language()).toBe('pt');
  });

  it('formats month and year in the active language', () => {
    const service = TestBed.inject(LanguageService);
    expect(service.formatMonthYear(2026, 5)).toBe('Mai 2026');

    service.toggle();

    expect(service.formatMonthYear(2026, 5)).toBe('May 2026');
  });
});
