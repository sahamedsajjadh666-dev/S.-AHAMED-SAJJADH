export type CardTheme = 'navy' | 'emerald' | 'crimson' | 'carbon';

export type StudentType = 'DAY SCHOLAR' | 'HOSTELLER' | 'INTERN' | 'ALUMNI';

export interface StudentCard {
  id: string;
  regNo: string;
  fullName: string;
  collegeName: string;
  collegeSubtitle: string;
  department: string;
  year: string;
  batch: string;
  studentType: StudentType;
  dob: string;
  bloodGroup: string;
  studentPhone: string;
  parentPhone: string;
  collegePhone: string;
  address: string;
  validThru: string;
  theme: CardTheme;
  holoEnabled: boolean;
  photoDataUrl: string;
}

export interface ThemePalette {
  id: CardTheme;
  label: string;
  description: string;
  startColor: string;
  endColor: string;
  accentColor: string;
  badgeText: string;
}

export const CARD_THEMES: readonly ThemePalette[] = [
  {
    id: 'navy',
    label: 'Institutional Navy',
    description: 'Deep Royal & Gold',
    startColor: '#0F294A',
    endColor: '#1E3A8A',
    accentColor: '#F59E0B',
    badgeText: '#FEF3C7',
  },
  {
    id: 'emerald',
    label: 'Campus Emerald',
    description: 'Forest & Mint',
    startColor: '#064E3B',
    endColor: '#047857',
    accentColor: '#34D399',
    badgeText: '#D1FAE5',
  },
  {
    id: 'crimson',
    label: 'Heritage Crimson',
    description: 'Maroon & Amber',
    startColor: '#7F1D1D',
    endColor: '#991B1B',
    accentColor: '#FBBF24',
    badgeText: '#FEF3C7',
  },
  {
    id: 'carbon',
    label: 'Executive Carbon',
    description: 'Graphite & Cyan',
    startColor: '#18181B',
    endColor: '#27272A',
    accentColor: '#38BDF8',
    badgeText: '#E0F2FE',
  },
] as const;

export const STUDENT_TYPES: readonly StudentType[] = [
  'DAY SCHOLAR',
  'HOSTELLER',
  'INTERN',
  'ALUMNI',
] as const;

export const MSAJCE_DEPARTMENTS: readonly string[] = [
  'B.E. Computer Science & Engineering',
  'B.Tech Information Technology',
  'B.Tech Artificial Intelligence & Data Science',
  'B.E. Electronics & Communication Engineering',
  'B.E. Electrical & Electronics Engineering',
  'B.E. Mechanical Engineering',
  'B.E. Civil Engineering',
  'M.E. Computer Science & Engineering',
] as const;

export const BLOOD_GROUPS: readonly string[] = [
  'O+',
  'O-',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
] as const;

export const YEAR_OPTIONS: readonly string[] = [
  'I Year',
  'II Year',
  'III Year',
  'IV Year',
  'Alumni',
] as const;

export const DEFAULT_COLLEGE_NAME = 'Mohamed Sathak A.J. College of Engineering';
export const DEFAULT_COLLEGE_SUBTITLE = 'Autonomous • Egattur, Chennai – 603103';
export const DEFAULT_COLLEGE_PHONE = '044-2747 0021';

export function createBlankStudentCard(id?: string): StudentCard {
  const uniqueId = id ?? `stu_${Date.now().toString(36)}`;
  return {
    id: uniqueId,
    regNo: '311826104001',
    fullName: 'New Student',
    collegeName: DEFAULT_COLLEGE_NAME,
    collegeSubtitle: DEFAULT_COLLEGE_SUBTITLE,
    department: 'B.E. Computer Science & Engineering',
    year: 'I Year',
    batch: '2026–2030',
    studentType: 'DAY SCHOLAR',
    dob: '01-01-2008',
    bloodGroup: 'O+',
    studentPhone: '+91 98400 00000',
    parentPhone: '+91 98400 00001',
    collegePhone: DEFAULT_COLLEGE_PHONE,
    address: 'Egattur, Old Mahabalipuram Road, Chennai – 603103',
    validThru: '05/2030',
    theme: 'navy',
    holoEnabled: true,
    photoDataUrl: '',
  };
}

export function getInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (parts.length === 0) {
    return 'MS';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
