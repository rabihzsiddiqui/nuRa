import { db } from './database';
import type { Severity } from './types';

export async function logSymptom(data: {
  symptomId: string;
  severity: Severity;
  note?: string;
}): Promise<void> {
  const now = Date.now();
  await db.symptomEntries.add({
    id: crypto.randomUUID(),
    symptomId: data.symptomId,
    severity: data.severity,
    note: data.note,
    occurredAt: now,
    createdAt: now,
  });
}

export async function deleteSymptomEntry(id: string): Promise<void> {
  await db.symptomEntries.delete(id);
}

export async function logMedication(data: {
  medicationId: string;
  dose: string;
  takenAt?: number;
  nextSafeAt?: number;
  note?: string;
}): Promise<void> {
  const now = Date.now();
  await db.medicationEntries.add({
    id: crypto.randomUUID(),
    medicationId: data.medicationId,
    dose: data.dose,
    takenAt: data.takenAt ?? now,
    nextSafeAt: data.nextSafeAt,
    note: data.note,
    createdAt: now,
  });
}

export async function deleteMedicationEntry(id: string): Promise<void> {
  await db.medicationEntries.delete(id);
}
