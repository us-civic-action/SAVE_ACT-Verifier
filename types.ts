
export type EligibilityStatus = 'Likely Eligible' | 'Action Required' | 'Ineligible';
export type AppView = 'checker' | 'privacy' | 'statutes' | 'contact';

export interface AccessibilitySettings {
  isDarkMode: boolean;
  isHighContrast: boolean;
  isLargeText: boolean;
}

export interface Option {
  id: string;
  label: string;
  value: any;
  description?: string;
}

export interface Question {
  id: string;
  text: string;
  plainEnglish: string;
  options: Option[];
  category: 'state' | 'citizenship' | 'age' | 'residency' | 'dpoc' | 'name_match';
}

export interface AppState {
  currentStep: number;
  answers: Record<string, any>;
  isPlainEnglishMode: boolean;
  selectedState: string | null;
  view: AppView;
  accessibility: AccessibilitySettings;
}

export interface StateLogic {
  code: string;
  name: string;
  strictDPOC: boolean;
  residencyDays: number;
  notes: string;
}
