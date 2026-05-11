"use client";

import { useState, useEffect, useMemo } from "react";
import type { Screen, AppSettings, SeverityLevel } from "@/lib/types";
import { getPalette, applyWarmth, fontBody } from "@/lib/theme";
import { loadSettings, saveSettings } from "@/lib/storage";
import { logSymptom } from "@/lib/db/queries";
import TabBar from "./TabBar";
import HomeScreen from "./HomeScreen";
import ModalSheet from "./ModalSheet";
import TimelineScreen from "./TimelineScreen";
import SettingsScreen from "./SettingsScreen";

export default function SymptomTracker() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [screen, setScreen] = useState<Screen>("log");
  const [modalSid, setModalSid] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const dark = settings.darkMode;
  const basePalette = getPalette(dark);
  const p = useMemo(
    () => applyWarmth(basePalette, settings.warmth, dark),
    [basePalette, settings.warmth, dark]
  );

  const openModal = (sid: string) => setModalSid(sid);

  const closeModal = (didSave?: boolean) => {
    setModalSid(null);
    if (didSave) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1600);
    }
  };

  const saveEntry = async ({
    sid,
    sev,
    note,
  }: {
    sid: string;
    sev: SeverityLevel;
    note: string;
  }) => {
    await logSymptom({ symptomId: sid, severity: sev, note: note || undefined });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: p.bg,
        color: p.ink,
        fontFamily: fontBody,
        fontSize: 16 * settings.textScale,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: p.wash,
        }}
      />
      {screen === "log" && (
        <HomeScreen
          onOpenModal={openModal}
          dark={dark}
          p={p}
          savedFlash={savedFlash}
        />
      )}
      {screen === "timeline" && (
        <TimelineScreen
          dark={dark}
          p={p}
          cbMode={settings.cbMode}
        />
      )}
      {screen === "settings" && (
        <SettingsScreen
          settings={settings}
          onUpdate={updateSettings}
          dark={dark}
          p={p}
        />
      )}

      <ModalSheet
        open={!!modalSid}
        sid={modalSid}
        dark={dark}
        p={p}
        cbMode={settings.cbMode}
        onClose={closeModal}
        onSave={saveEntry}
      />

      <TabBar
        screen={screen}
        setScreen={setScreen}
        dark={dark}
        p={p}
      />
    </div>
  );
}
