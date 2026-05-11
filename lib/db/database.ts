import Dexie, { type Table } from 'dexie';
import type { Symptom, SymptomEntry, Medication, MedicationEntry } from './types';

const DEFAULT_SYMPTOMS: Symptom[] = [
  { id: 'headache', name: 'Headache', emoji: '🤕', color: '#7a5a1f', position: 0, isArchived: false, createdAt: 0 },
  { id: 'nausea',   name: 'Nausea',   emoji: '🤢', color: '#4f6b3a', position: 1, isArchived: false, createdAt: 0 },
  { id: 'stomach',  name: 'Stomach',  emoji: '🫃', color: '#8a4f30', position: 2, isArchived: false, createdAt: 0 },
  { id: 'fatigue',  name: 'Fatigue',  emoji: '😴', color: '#5a5530', position: 3, isArchived: false, createdAt: 0 },
  { id: 'anxiety',  name: 'Anxiety',  emoji: '😰', color: '#7b4438', position: 4, isArchived: false, createdAt: 0 },
  { id: 'pain',     name: 'Pain',     emoji: '🩹', color: '#5a3f63', position: 5, isArchived: false, createdAt: 0 },
];

class AppDB extends Dexie {
  symptoms!: Table<Symptom>;
  symptomEntries!: Table<SymptomEntry>;
  medications!: Table<Medication>;
  medicationEntries!: Table<MedicationEntry>;

  constructor() {
    super('health-tracker');
    this.version(1).stores({
      symptoms:          'id, position, isArchived',
      symptomEntries:    'id, symptomId, occurredAt',
      medications:       'id, isArchived',
      medicationEntries: 'id, medicationId, takenAt',
    });

    this.on('ready', async () => {
      const count = await this.symptoms.count();
      if (count === 0) {
        await this.symptoms.bulkAdd(DEFAULT_SYMPTOMS);
      }
    });
  }
}

let _db: AppDB | null = null;

export function getDb(): AppDB {
  if (!_db) _db = new AppDB();
  return _db;
}

export const db = typeof window !== 'undefined' ? getDb() : (null as unknown as AppDB);
