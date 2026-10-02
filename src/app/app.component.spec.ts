import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: true })
    });
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the correct title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Nicolas Bezerra Bini - Portfolio');
  });

  it('should render name in h1', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Nicolas Bezerra Bini');
  });

  it('switches the whole page between Portuguese and English', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.lang-toggle')!;

    expect(compiled.querySelector('#sobre h2')?.textContent).toContain('Sobre Mim');
    expect(toggle.querySelector('img')?.getAttribute('src')).toBe('assets/flags/us.svg');
    expect(toggle.getAttribute('aria-label')).toBe('Switch to English');
    expect(compiled.querySelector('#certificacoes .date')?.textContent).toContain('Emitido em Mai 2026');

    toggle.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#sobre h2')?.textContent).toContain('About Me');
    expect(compiled.querySelector('#educacao .date')?.textContent).toContain('2026 - In progress');
    expect(compiled.querySelector('#certificacoes .date')?.textContent).toContain('Issued May 2026');
    expect(toggle.querySelector('img')?.getAttribute('src')).toBe('assets/flags/br.svg');
    expect(toggle.getAttribute('aria-label')).toBe('Mudar para português');
    expect(localStorage.getItem('lang')).toBe('en');
  });
});
