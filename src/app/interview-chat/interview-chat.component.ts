import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  InterviewResult,
  InterviewService,
  MAX_QUESTION_LENGTH,
  MIN_QUESTION_LENGTH
} from './interview.service';
import { LanguageService } from '../i18n/language.service';

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  sources: string[];
  tone: 'default' | 'notice' | 'error';
}

@Component({
  selector: 'app-interview-chat',
  templateUrl: './interview-chat.component.html',
  styleUrl: './interview-chat.component.css',
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class InterviewChatComponent {
  private interviewService = inject(InterviewService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private nextId = 1;

  private launcher = viewChild<ElementRef<HTMLButtonElement>>('launcher');
  private input = viewChild<ElementRef<HTMLTextAreaElement>>('input');
  private log = viewChild<ElementRef<HTMLElement>>('log');
  private panel = viewChild<ElementRef<HTMLElement>>('panel');

  private language = inject(LanguageService);
  readonly t = this.language.t;
  readonly maxLength = MAX_QUESTION_LENGTH;
  readonly suggestions = computed(() => this.t().chat.suggestions);

  readonly isOpen = signal(false);
  readonly draft = signal('');
  readonly pending = signal(false);
  readonly messages = signal<ChatMessage[]>([]);

  readonly hasAsked = computed(() => this.messages().some((message) => message.role === 'user'));
  readonly draftLength = computed(() => this.draft().length);
  readonly canSend = computed(() => {
    const length = this.draft().trim().length;
    return !this.pending() && length >= MIN_QUESTION_LENGTH && length <= MAX_QUESTION_LENGTH;
  });

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen.set(true);
    afterNextRender(
      () => {
        this.scrollToBottom();
        this.input()?.nativeElement.focus();
      },
      { injector: this.injector }
    );
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }
    this.isOpen.set(false);
    afterNextRender(() => this.launcher()?.nativeElement.focus(), { injector: this.injector });
  }

  toggleLanguage(): void {
    this.language.toggle();
  }

  onEscape(): void {
    this.close();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.draft.set(value.slice(0, MAX_QUESTION_LENGTH));
  }

  onEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey || keyboardEvent.isComposing) {
      return;
    }
    keyboardEvent.preventDefault();
    this.send();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.send();
  }

  askSuggestion(question: string): void {
    this.send(question);
  }

  send(text: string = this.draft()): void {
    const question = text.trim();
    if (this.pending() || question.length < MIN_QUESTION_LENGTH || question.length > MAX_QUESTION_LENGTH) {
      return;
    }
    this.addMessage({ role: 'user', text: question, sources: [], tone: 'default' });
    this.draft.set('');
    this.pending.set(true);

    this.interviewService
      .ask(question)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.pending.set(false);
        this.addMessage(this.toMessage(result));
        afterNextRender(() => this.restoreInputFocus(), { injector: this.injector });
      });
  }

  private toMessage(result: InterviewResult): Omit<ChatMessage, 'id'> {
    if (result.kind === 'error') {
      return { role: 'assistant', text: result.text, sources: [], tone: 'error' };
    }
    if (result.status === 'ANSWERED') {
      return { role: 'assistant', text: result.text, sources: result.sources, tone: 'default' };
    }
    const chat = this.t().chat;
    const text = result.status === 'REJECTED' ? chat.rejected : chat.outOfScope;
    return { role: 'assistant', text, sources: [], tone: 'notice' };
  }

  private addMessage(message: Omit<ChatMessage, 'id'>): void {
    this.messages.update((messages) => [...messages, { ...message, id: this.nextId++ }]);
    afterNextRender(() => this.scrollToBottom(), { injector: this.injector });
  }

  private restoreInputFocus(): void {
    const active = document.activeElement;
    const panel = this.panel()?.nativeElement;
    if (panel && (!active || active === document.body || panel.contains(active))) {
      this.input()?.nativeElement.focus({ preventScroll: true });
    }
  }

  private scrollToBottom(): void {
    const element = this.log()?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
