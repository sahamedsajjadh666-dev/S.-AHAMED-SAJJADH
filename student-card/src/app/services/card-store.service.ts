import { Injectable, computed, signal } from '@angular/core';
import {
  StudentCard,
  createBlankStudentCard,
} from '../models/student-card.model';

const STORAGE_KEY = 'edupass_msajce_v1';

const SEED_CARDS: readonly StudentCard[] = [
  {
    id: 'stu_101',
    regNo: '311824104089',
    fullName: 'Aanya Sharma',
    collegeName: 'Mohamed Sathak A.J. College of Engineering',
    collegeSubtitle: 'Autonomous • Egattur, Chennai – 603103',
    department: 'B.E. Computer Science & Engineering',
    year: 'III Year',
    batch: '2024–2028',
    studentType: 'DAY SCHOLAR',
    dob: '14-08-2006',
    bloodGroup: 'O+',
    studentPhone: '+91 98401 22334',
    parentPhone: '+91 98400 12345',
    collegePhone: '044-2747 0021',
    address: '14, Gandhi Nagar, Adyar, Chennai – 600020',
    validThru: '05/2028',
    theme: 'navy',
    holoEnabled: true,
    photoDataUrl: '',
  },
  {
    id: 'stu_102',
    regNo: '311825205042',
    fullName: 'Rohan Menon',
    collegeName: 'Mohamed Sathak A.J. College of Engineering',
    collegeSubtitle: 'Autonomous • Egattur, Chennai – 603103',
    department: 'B.Tech Information Technology',
    year: 'II Year',
    batch: '2025–2029',
    studentType: 'HOSTELLER',
    dob: '22-11-2007',
    bloodGroup: 'B+',
    studentPhone: '+91 98415 33445',
    parentPhone: '+91 98412 67890',
    collegePhone: '044-2747 0021',
    address: 'Boys Hostel Block-B, Room 214, Egattur Campus',
    validThru: '05/2029',
    theme: 'emerald',
    holoEnabled: true,
    photoDataUrl: '',
  },
];

function cloneCard(card: StudentCard): StudentCard {
  return { ...card };
}

function isValidStudentCard(candidate: unknown): candidate is StudentCard {
  if (!candidate || typeof candidate !== 'object') {
    return false;
  }
  const obj = candidate as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['regNo'] === 'string' &&
    typeof obj['fullName'] === 'string' &&
    typeof obj['theme'] === 'string'
  );
}

@Injectable({
  providedIn: 'root',
})
export class CardStoreService {
  private readonly initialCards = this.loadCardsFromStorage();

  readonly cards = signal<StudentCard[]>(this.initialCards);
  readonly selectedId = signal<string>(this.initialCards[0]?.id ?? '');
  readonly searchQuery = signal<string>('');
  readonly draftCard = signal<StudentCard>(
    cloneCard(this.initialCards[0] ?? createBlankStudentCard()),
  );
  readonly statusMessage = signal<string>('');

  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  readonly selectedSavedCard = computed<StudentCard | null>(() => {
    const id = this.selectedId();
    return this.cards().find((card) => card.id === id) ?? null;
  });

  readonly isNewDraft = computed<boolean>(() => {
    const draftId = this.draftCard().id;
    return !this.cards().some((card) => card.id === draftId);
  });

  readonly isDirty = computed<boolean>(() => {
    const saved = this.selectedSavedCard();
    const draft = this.draftCard();
    if (!saved) {
      return true;
    }
    return JSON.stringify(saved) !== JSON.stringify(draft);
  });

  private loadCardsFromStorage(): StudentCard[] {
    if (typeof localStorage === 'undefined') {
      return SEED_CARDS.map(cloneCard);
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = SEED_CARDS.map(cloneCard);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
      }
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.filter(isValidStudentCard).map(cloneCard);
        if (valid.length > 0) {
          return valid;
        }
      }
      if (Array.isArray(parsed) && parsed.length === 0) {
        return [];
      }
    } catch {
      // Fallback to seeded roster if storage is corrupted
    }
    const seeded = SEED_CARDS.map(cloneCard);
    this.persistCards(seeded);
    return seeded;
  }

  private persistCards(nextCards: StudentCard[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCards));
    } catch {
      this.flashStatus('Storage quota reached — trim large image data.');
    }
  }

  private flashStatus(message: string): void {
    this.statusMessage.set(message);
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
    }
    this.statusTimer = setTimeout(() => {
      this.statusMessage.set('');
      this.statusTimer = null;
    }, 2800);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  selectCard(id: string): void {
    const found = this.cards().find((card) => card.id === id);
    if (!found) {
      return;
    }
    this.selectedId.set(found.id);
    this.draftCard.set(cloneCard(found));
  }

  updateDraft(updated: StudentCard): void {
    this.draftCard.set(cloneCard(updated));
  }

  saveDraft(): void {
    const draft = cloneCard(this.draftCard());
    const existingIndex = this.cards().findIndex((c) => c.id === draft.id);
    let nextCards: StudentCard[];

    if (existingIndex >= 0) {
      nextCards = this.cards().map((c, idx) =>
        idx === existingIndex ? draft : c,
      );
      this.flashStatus(`Updated ${draft.fullName} in campus roster.`);
    } else {
      nextCards = [draft, ...this.cards()];
      this.flashStatus(`Added ${draft.fullName} to campus roster.`);
    }

    this.cards.set(nextCards);
    this.selectedId.set(draft.id);
    this.draftCard.set(cloneCard(draft));
    this.persistCards(nextCards);
  }

  resetDraft(): void {
    const saved = this.selectedSavedCard();
    if (saved) {
      this.draftCard.set(cloneCard(saved));
      this.flashStatus('Reverted unsaved edits.');
      return;
    }
    const fresh = createBlankStudentCard(this.draftCard().id);
    this.draftCard.set(fresh);
    this.flashStatus('Reset new student form.');
  }

  createNewCard(): void {
    const fresh = createBlankStudentCard();
    this.selectedId.set('');
    this.draftCard.set(fresh);
    this.flashStatus('Editing new student record — click Save to add.');
  }

  deleteCard(id: string): void {
    const target = this.cards().find((c) => c.id === id);
    const remaining = this.cards().filter((c) => c.id !== id);
    this.cards.set(remaining);
    this.persistCards(remaining);

    if (this.selectedId() === id || this.draftCard().id === id) {
      if (remaining.length > 0) {
        this.selectedId.set(remaining[0].id);
        this.draftCard.set(cloneCard(remaining[0]));
      } else {
        const blank = createBlankStudentCard();
        this.selectedId.set('');
        this.draftCard.set(blank);
      }
    }

    if (target) {
      this.flashStatus(`Removed ${target.fullName} from roster.`);
    }
  }

  restoreSampleRoster(): void {
    const seeded = SEED_CARDS.map(cloneCard);
    this.cards.set(seeded);
    this.selectedId.set(seeded[0].id);
    this.draftCard.set(cloneCard(seeded[0]));
    this.searchQuery.set('');
    this.persistCards(seeded);
    this.flashStatus('Restored MSAJCE sample student roster.');
  }
}
