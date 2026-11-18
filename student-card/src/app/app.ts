import { Component, inject, signal } from '@angular/core';
import { CardEditorFormComponent } from './components/card-editor-form/card-editor-form.component';
import { CardPreviewComponent } from './components/card-preview/card-preview.component';
import { PrintSheetComponent } from './components/print-sheet/print-sheet.component';
import { RosterListComponent } from './components/roster-list/roster-list.component';
import { CardStoreService } from './services/card-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CardPreviewComponent,
    CardEditorFormComponent,
    RosterListComponent,
    PrintSheetComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly store = inject(CardStoreService);
  readonly isFlipped = signal<boolean>(false);

  toggleFlip(): void {
    this.isFlipped.update((current) => !current);
  }

  setFace(flipped: boolean): void {
    this.isFlipped.set(flipped);
  }

  createNewStudent(): void {
    this.store.createNewCard();
    this.isFlipped.set(false);
  }

  selectStudent(id: string): void {
    this.store.selectCard(id);
  }

  printCard(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
