import { Component, computed, input } from '@angular/core';

interface QrCell {
  x: number;
  y: number;
}

interface BarcodeBar {
  x: number;
  w: number;
}

function fnv1a32(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function nextXorShift(state: number): number {
  let x = state || 0x9e3779b9;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

@Component({
  selector: 'app-qr-barcode',
  standalone: true,
  templateUrl: './qr-barcode.component.html',
  styleUrl: './qr-barcode.component.css',
})
export class QrBarcodeComponent {
  readonly payload = input<string>('');
  readonly mode = input<'qr' | 'barcode'>('qr');

  readonly qrCells = computed<QrCell[]>(() => {
    const size = 21;
    const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
      Array<boolean | null>(size).fill(null),
    );

    const placeFinder = (startX: number, startY: number): void => {
      for (let dy = -1; dy <= 7; dy++) {
        for (let dx = -1; dx <= 7; dx++) {
          const x = startX + dx;
          const y = startY + dy;
          if (x < 0 || x >= size || y < 0 || y >= size) {
            continue;
          }
          if (dx === -1 || dx === 7 || dy === -1 || dy === 7) {
            matrix[y][x] = false;
          } else {
            const onOuter = dx === 0 || dx === 6 || dy === 0 || dy === 6;
            const onInner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
            matrix[y][x] = onOuter || onInner;
          }
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(14, 0);
    placeFinder(0, 14);

    // Timing patterns
    for (let i = 8; i <= 12; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Mandatory dark module
    matrix[13][8] = true;

    // Seed PRNG deterministically from payload
    const text = this.payload().trim() || 'MSAJCE-EDUPASS';
    let state = fnv1a32(text) ^ Math.imul(text.length + 17, 0x45d9f3b);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (matrix[y][x] !== null) {
          continue;
        }
        state = nextXorShift(state ^ ((x + 1) * 31 + (y + 1) * 19));
        matrix[y][x] = (state & 1) === 1;
      }
    }

    const cells: QrCell[] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (matrix[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  });

  readonly barcodeData = computed<{ bars: BarcodeBar[]; width: number }>(() => {
    const raw = (this.payload().trim() || '311824104089').slice(0, 24);
    const patternWidths: number[] = [];

    // Start guard (Code 128-B style: 2-1-1-2-1-4)
    patternWidths.push(2, 1, 1, 2, 1, 4);

    // Encode each character into 3 bar + 3 space modules summing to 11
    for (let i = 0; i < raw.length; i++) {
      const code = raw.charCodeAt(i);
      const b1 = 1 + (code % 3);
      const s1 = 1 + ((code >> 1) % 3);
      const b2 = 1 + ((code + i) % 3);
      const s2 = 1 + ((code >> 2) % 2);
      const b3 = 1 + ((code + i * 3) % 2);
      const used = b1 + s1 + b2 + s2 + b3;
      const s3 = Math.max(1, 11 - used);
      patternWidths.push(b1, s1, b2, s2, b3, s3);
    }

    // Checksum symbol
    const hash = fnv1a32(raw);
    patternWidths.push(
      1 + (hash % 3),
      1 + ((hash >> 2) % 2),
      1 + ((hash >> 4) % 3),
      1 + ((hash >> 6) % 2),
      2,
      1,
    );

    // Stop guard (2-3-3-1-1-1-2)
    patternWidths.push(2, 3, 3, 1, 1, 1, 2);

    const bars: BarcodeBar[] = [];
    let cursor = 2; // quiet zone left
    for (let i = 0; i < patternWidths.length; i++) {
      const w = patternWidths[i];
      if (i % 2 === 0) {
        bars.push({ x: cursor, w });
      }
      cursor += w;
    }
    cursor += 2; // quiet zone right

    return { bars, width: cursor };
  });
}
