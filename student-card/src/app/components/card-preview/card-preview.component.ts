import { Component, computed, input, output, signal } from '@angular/core';
import {
  CARD_THEMES,
  StudentCard,
  getInitials,
} from '../../models/student-card.model';
import { QrBarcodeComponent } from '../qr-barcode/qr-barcode.component';

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [QrBarcodeComponent],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.css',
})
export class CardPreviewComponent {
  readonly card = input.required<StudentCard>();
  readonly flipped = input<boolean>(false);
  readonly interactive = input<boolean>(true);
  readonly printMode = input<boolean>(false);

  readonly flipToggle = output<void>();

  readonly pointerX = signal<number>(72);
  readonly pointerY = signal<number>(28);
  readonly isHovering = signal<boolean>(false);

  readonly initials = computed<string>(() =>
    getInitials(this.card().fullName),
  );

  readonly themePalette = computed(() => {
    const themeId = this.card().theme;
    return CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[0];
  });

  readonly qrPayload = computed<string>(() => {
    const c = this.card();
    return `MSAJCE|${c.regNo}|${c.fullName}|${c.department}|${c.validThru}`;
  });

  readonly tiltTransform = computed<string>(() => {
    if (!this.interactive() || this.printMode() || !this.isHovering()) {
      return '';
    }
    const rx = ((this.pointerY() - 50) / 50) * -3.5;
    const ry = ((this.pointerX() - 50) / 50) * 3.5;
    return `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  });

  onCardClick(): void {
    if (this.interactive() && !this.printMode()) {
      this.flipToggle.emit();
    }
  }

  onCardKeydown(event: KeyboardEvent): void {
    if (!this.interactive() || this.printMode()) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.flipToggle.emit();
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.interactive() || this.printMode()) {
      return;
    }
    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    this.pointerX.set(x);
    this.pointerY.set(y);
    this.isHovering.set(true);
  }

  onPointerLeave(): void {
    this.isHovering.set(false);
    this.pointerX.set(72);
    this.pointerY.set(28);
  }
}
