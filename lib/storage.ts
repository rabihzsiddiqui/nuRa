import type { Entry, AppSettings } from "./types";
import { SEED_ENTRIES } from "./symptoms";

const ENTRIES_KEY = "st_entries";
const SETTINGS_KEY = "st_settings";

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  darkModeAuto: "off",
  darkModeStart: "20:00",
  darkModeEnd: "06:00",
  cbMode: "off",
  textScale: 1,
  warmth: 1,
};

export function loadEntries(): Entry[] {
  if (typeof window === "undefined") return SEED_ENTRIES;
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return SEED_ENTRIES;
    return JSON.parse(raw) as Entry[];
  } catch {
    return SEED_ENTRIES;
  }
}

export function saveEntries(entries: Entry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const saved = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as AppSettings;
    const validScales = [0.9, 1, 1.1];
    if (!validScales.includes(saved.textScale)) saved.textScale = 1;
    return saved;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
