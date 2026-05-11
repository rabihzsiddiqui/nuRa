export type Severity = 'mild' | 'bad' | 'terrible';

export interface Symptom {
  id: string;
  name: string;
  emoji: string;
  color: string;
  position: number;
  isArchived: boolean;
  createdAt: number;
}

export interface SymptomEntry {
  id: string;
  symptomId: string;
  severity: Severity;
  note?: string;
  occurredAt: number;
  createdAt: number;
}

export interface Medication {
  id: string;
  name: string;
  defaultDose?: string;
  isArchived: boolean;
  createdAt: number;
}

export interface MedicationEntry {
  id: string;
  medicationId: string;
  dose: string;
  takenAt: number;
  nextSafeAt?: number;
  note?: string;
  createdAt: number;
}
