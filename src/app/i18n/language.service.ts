import { Injectable, computed, signal } from '@angular/core';
import { Language, TRANSLATIONS, Translations } from './translations';

const STORAGE_KEY = 'lang';
const HTML_LANG: Record<Language, string> = { pt: 'pt-BR', en: 'en' };

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly language = signal<Language>(this.readStoredLanguage());
  readonly t = computed<Translations>(() => TRANSLATIONS[this.language()]);

  constructor() {
    this.applyToDocument(this.language());
  }

  toggle(): void {
    this.set(this.language() === 'pt' ? 'en' : 'pt');
  }

  set(language: Language): void {
    this.language.set(language);
    this.applyToDocument(language);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      return;
    }
  }

  formatMonthYear(year: number, month: number): string {
    return `${this.t().months[month - 1]} ${year}`;
  }

  private readStoredLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'en' ? 'en' : 'pt';
    } catch {
      return 'pt';
    }
  }

  private applyToDocument(language: Language): void {
    document.documentElement.lang = HTML_LANG[language];
  }
}
