import { Component, computed, input, output } from '@angular/core';
import {
  CARD_THEMES,
  CardTheme,
  StudentCard,
  getInitials,
} from '../../models/student-card.model';

@Component({
  selector: 'app-roster-list',
  standalone: true,
  templateUrl: './roster-list.component.html',
  styleUrl: './roster-list.component.css',
})
export class RosterListComponent {
  readonly cards = input.required<StudentCard[]>();
  readonly selectedId = input<string>('');
  readonly searchQuery = input<string>('');

  readonly searchChange = output<string>();
  readonly selectCard = output<string>();
  readonly deleteCard = output<string>();

  readonly filteredCards = computed<StudentCard[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.cards();
    if (!query) {
      return list;
    }
    return list.filter((card) => {
      return (
        card.fullName.toLowerCase().includes(query) ||
        card.regNo.toLowerCase().includes(query) ||
        card.department.toLowerCase().includes(query) ||
        card.batch.toLowerCase().includes(query) ||
        card.studentPhone.toLowerCase().includes(query) ||
        card.parentPhone.toLowerCase().includes(query)
      );
    });
  });

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  clearSearch(): void {
    this.searchChange.emit('');
  }

  onSelect(id: string): void {
    this.selectCard.emit(id);
  }

  onDelete(id: string, event: Event): void {
    event.stopPropagation();
    this.deleteCard.emit(id);
  }

  initialsFor(fullName: string): string {
    return getInitials(fullName);
  }

  themeColorFor(themeId: CardTheme): string {
    return CARD_THEMES.find((t) => t.id === themeId)?.startColor ?? '#0F294A';
  }
}
