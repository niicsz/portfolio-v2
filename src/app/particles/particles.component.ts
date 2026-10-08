import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  inject
} from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

@Component({
  selector: 'app-particles',
  standalone: true,
  template: `<canvas #canvas class="particles-canvas" aria-hidden="true"></canvas>`,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .particles-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private rafId = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private readonly linkDistance = 150;
  private rgb = '59, 130, 246';

  private readonly pointer = { x: 0, y: 0, active: false };
  private resizeObserver?: ResizeObserver;
  private themeObserver?: MutationObserver;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    this.ctx = ctx;

    this.refreshColor();
    this.resize();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);

    this.themeObserver = new MutationObserver(() => this.refreshColor());
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave);

    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(this.frame);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.themeObserver?.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
  }

  private refreshColor(): void {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim();
    const parsed = this.hexToRgb(accent);
    if (parsed) {
      this.rgb = parsed;
    }
  }

  private hexToRgb(hex: string): string | null {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) {
      return null;
    }
    return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    canvas.width = Math.round(this.width * this.dpr);
    canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.build();
  }

  private build(): void {
    if (this.width <= 0 || this.height <= 0) {
      this.particles = [];
      return;
    }
    const count = Math.max(
      34,
      Math.min(150, Math.round((this.width * this.height) / 6500))
    );
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      r: Math.random() * 1.6 + 0.8
    }));
  }

  private readonly onPointerMove = (e: PointerEvent): void => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.pointer.x = e.clientX - rect.left;
    this.pointer.y = e.clientY - rect.top;
    this.pointer.active =
      this.pointer.x >= 0 &&
      this.pointer.y >= 0 &&
      this.pointer.x <= rect.width &&
      this.pointer.y <= rect.height;
  };

  private readonly onPointerLeave = (): void => {
    this.pointer.active = false;
  };

  private step(): void {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = this.width + 20;
      else if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      else if (p.y > this.height + 20) p.y = -20;

      if (this.pointer.active) {
        const dx = p.x - this.pointer.x;
        const dy = p.y - this.pointer.y;
        const d2 = dx * dx + dy * dy;
        const radius = 170;
        if (d2 < radius * radius && d2 > 1) {
          const d = Math.sqrt(d2);
          const force = ((radius - d) / radius) * 4;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }
      }
    }
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    const link2 = this.linkDistance * this.linkDistance;

    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < link2) {
          const alpha = (1 - d2 / link2) * 0.5;
          ctx.strokeStyle = `rgba(${this.rgb}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = `rgba(${this.rgb}, 0.85)`;
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private readonly frame = (): void => {
    this.step();
    this.draw();
    this.rafId = requestAnimationFrame(this.frame);
  };
}
