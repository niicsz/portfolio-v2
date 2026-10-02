import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { InterviewChatComponent } from './interview-chat.component';
import { InterviewResult, InterviewService } from './interview.service';

describe('InterviewChatComponent', () => {
  let fixture: ComponentFixture<InterviewChatComponent>;
  let component: InterviewChatComponent;
  let host: HTMLElement;
  let responses: Subject<InterviewResult>;
  let ask: jest.Mock;

  beforeEach(async () => {
    responses = new Subject<InterviewResult>();
    ask = jest.fn(() => responses.asObservable());
    await TestBed.configureTestingModule({
      imports: [InterviewChatComponent],
      providers: [{ provide: InterviewService, useValue: { ask } }]
    }).compileComponents();
    fixture = TestBed.createComponent(InterviewChatComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    await fixture.whenStable();
  });

  afterEach(() => host.remove());

  async function openPanel(): Promise<void> {
    host.querySelector<HTMLButtonElement>('.chat-launcher')!.click();
    await fixture.whenStable();
  }

  async function type(value: string): Promise<HTMLTextAreaElement> {
    const textarea = host.querySelector<HTMLTextAreaElement>('textarea')!;
    textarea.value = value;
    textarea.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    return textarea;
  }

  function sendButton(): HTMLButtonElement {
    return host.querySelector<HTMLButtonElement>('.send-btn')!;
  }

  it('opens the panel, shows intro and suggestions, and focuses the input', async () => {
    expect(host.querySelector('[role="dialog"]')).toBeNull();
    await openPanel();
    expect(host.querySelector('[role="dialog"]')).not.toBeNull();
    expect(host.querySelector('.chat-launcher')!.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelectorAll('.suggestion').length).toBe(4);
    expect(document.activeElement).toBe(host.querySelector('textarea'));
  });

  it('closes on Escape and returns focus to the launcher', async () => {
    await openPanel();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(host.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(host.querySelector('.chat-launcher'));
  });

  it('keeps send disabled while the question is too short', async () => {
    await openPanel();
    expect(sendButton().disabled).toBe(true);
    await type('ab');
    expect(sendButton().disabled).toBe(true);
    await type('abc');
    expect(sendButton().disabled).toBe(false);
    expect(host.querySelector('.counter')!.textContent).toContain('3/500');
  });

  it('sends on Enter, shows typing indicator, and renders the answer as text', async () => {
    await openPanel();
    const textarea = await type('Onde ele estuda?');
    const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    textarea.dispatchEvent(enter);
    await fixture.whenStable();

    expect(enter.defaultPrevented).toBe(true);
    expect(ask).toHaveBeenCalledWith('Onde ele estuda?');
    expect(host.querySelector('.typing')).not.toBeNull();
    expect(sendButton().disabled).toBe(true);
    expect(host.querySelector('.suggestions')).toBeNull();

    responses.next({ kind: 'answer', status: 'ANSWERED', text: '<img src=x onerror=alert(1)>', sources: ['Educação'] });
    await fixture.whenStable();

    const answer = host.querySelectorAll('.msg-assistant')[1];
    expect(host.querySelector('.typing')).toBeNull();
    expect(answer.querySelector('img')).toBeNull();
    expect(answer.querySelector('.msg-text')!.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(answer.querySelector('.msg-sources')!.textContent).toContain('Educação');
  });

  it('does not send on Shift+Enter', async () => {
    await openPanel();
    const textarea = await type('Onde ele estuda?');
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, cancelable: true }));
    await fixture.whenStable();
    expect(ask).not.toHaveBeenCalled();
  });

  it('sends a suggested question when clicked and blocks new sends while pending', async () => {
    await openPanel();
    host.querySelector<HTMLButtonElement>('.suggestion')!.click();
    await fixture.whenStable();
    expect(ask).toHaveBeenCalledWith(component.suggestions[0]);

    component.send('Outra pergunta');
    expect(ask).toHaveBeenCalledTimes(1);
  });

  it('renders errors as an error message', async () => {
    await openPanel();
    component.send('Onde ele estuda?');
    responses.next({ kind: 'error', httpStatus: 503, text: 'Indisponível' });
    await fixture.whenStable();
    const error = host.querySelector('.msg-error');
    expect(error).not.toBeNull();
    expect(error!.textContent).toContain('Indisponível');
    expect(error!.querySelector('.msg-sources')).toBeNull();
  });
});
