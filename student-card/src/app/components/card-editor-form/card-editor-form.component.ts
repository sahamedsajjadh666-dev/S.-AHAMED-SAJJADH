import { Component, computed, input, output } from '@angular/core';
import {
  BLOOD_GROUPS,
  CardTheme,
  MSAJCE_DEPARTMENTS,
  STUDENT_TYPES,
  StudentCard,
  StudentType,
  YEAR_OPTIONS,
  getInitials,
} from '../../models/student-card.model';
import { AvatarUploaderComponent } from '../avatar-uploader/avatar-uploader.component';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

@Component({
  selector: 'app-card-editor-form',
  standalone: true,
  imports: [AvatarUploaderComponent, ThemeSelectorComponent],
  templateUrl: './card-editor-form.component.html',
  styleUrl: './card-editor-form.component.css',
})
export class CardEditorFormComponent {
  readonly card = input.required<StudentCard>();

  readonly cardChange = output<StudentCard>();
  readonly save = output<void>();
  readonly reset = output<void>();
  readonly print = output<void>();

  readonly departments = MSAJCE_DEPARTMENTS;
  readonly studentTypes = STUDENT_TYPES;
  readonly bloodGroups = BLOOD_GROUPS;
  readonly years = YEAR_OPTIONS;

  readonly initials = computed<string>(() =>
    getInitials(this.card().fullName),
  );

  updateField<K extends keyof StudentCard>(key: K, value: StudentCard[K]): void {
    this.cardChange.emit({
      ...this.card(),
      [key]: value,
    });
  }

  onTextInput<K extends keyof StudentCard>(key: K, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.updateField(key, target.value as StudentCard[K]);
  }

  onStudentTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateField('studentType', target.value as StudentType);
  }

  onThemeChange(theme: CardTheme): void {
    this.updateField('theme', theme);
  }

  onHoloChange(enabled: boolean): void {
    this.updateField('holoEnabled', enabled);
  }

  onPhotoChange(dataUrl: string): void {
    this.updateField('photoDataUrl', dataUrl);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.save.emit();
  }
}
