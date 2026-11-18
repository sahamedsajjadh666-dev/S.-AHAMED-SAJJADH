import { Component, input, output, signal } from '@angular/core';

const ACCEPTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

@Component({
  selector: 'app-avatar-uploader',
  standalone: true,
  templateUrl: './avatar-uploader.component.html',
  styleUrl: './avatar-uploader.component.css',
})
export class AvatarUploaderComponent {
  readonly photoUrl = input<string>('');
  readonly initials = input<string>('ST');
  readonly photoChange = output<string>();

  readonly isDragging = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly isProcessing = signal<boolean>(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      void this.processImageFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    if (file) {
      void this.processImageFile(file);
    }
    inputEl.value = '';
  }

  removePhoto(): void {
    this.errorMessage.set('');
    this.photoChange.emit('');
  }

  private async processImageFile(file: File): Promise<void> {
    this.errorMessage.set('');
    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      this.errorMessage.set('Please upload a JPG, PNG, or WebP portrait.');
      return;
    }

    this.isProcessing.set(true);
    try {
      const dataUrl = await this.cropAndCompress(file);
      this.photoChange.emit(dataUrl);
    } catch {
      this.errorMessage.set('Could not decode image file. Try another photo.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private cropAndCompress(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File read error'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Image decode error'));
        img.onload = () => {
          const targetW = 300;
          const targetH = 360;
          const targetAspect = targetW / targetH;
          const sourceAspect = img.width / img.height;

          let sx = 0;
          let sy = 0;
          let sWidth = img.width;
          let sHeight = img.height;

          if (sourceAspect > targetAspect) {
            sWidth = img.height * targetAspect;
            sx = (img.width - sWidth) / 2;
          } else {
            sHeight = img.width / targetAspect;
            sy = Math.max(0, (img.height - sHeight) * 0.25);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);

          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }
}
