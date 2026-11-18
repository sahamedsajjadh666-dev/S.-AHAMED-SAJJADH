import { Component, input, output } from '@angular/core';
import { CARD_THEMES, CardTheme } from '../../models/student-card.model';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.css',
})
export class ThemeSelectorComponent {
  readonly selectedTheme = input.required<CardTheme>();
  readonly holoEnabled = input<boolean>(true);

  readonly themeChange = output<CardTheme>();
  readonly holoChange = output<boolean>();

  readonly themes = CARD_THEMES;

  selectTheme(themeId: CardTheme): void {
    this.themeChange.emit(themeId);
  }

  toggleHolo(): void {
    this.holoChange.emit(!this.holoEnabled());
  }
}
