import { Component, input } from '@angular/core';
import { StudentCard } from '../../models/student-card.model';
import { CardPreviewComponent } from '../card-preview/card-preview.component';

@Component({
  selector: 'app-print-sheet',
  standalone: true,
  imports: [CardPreviewComponent],
  templateUrl: './print-sheet.component.html',
  styleUrl: './print-sheet.component.css',
})
export class PrintSheetComponent {
  readonly card = input.required<StudentCard>();
}
