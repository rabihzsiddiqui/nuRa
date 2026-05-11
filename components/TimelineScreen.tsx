"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { ThemePalette, CbMode, TimelineView } from "@/lib/types";
import type { SymptomEntry } from "@/lib/db/types";
import { fontDisplay, fontMono } from "@/lib/theme";
import { db } from "@/lib/db/database";
import TimelineRow from "./TimelineRow";
import CalendarView from "./CalendarView";

interface TimelineScreenProps {
  dark: boolean;
  p: ThemePalette;
  cbMode: CbMode;
}

function toDayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dayKeyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m, d);
}

function dayLabel(key: string): string {
  const date = dayKeyToDate(key);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

function dayDate(key: string): string {
  return dayKeyToDate(key).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function TimelineScreen({ dark, p, cbMode }: TimelineScreenProps) {
  const [view, setView] = useState<TimelineView>("day");

  const entries =
    useLiveQuery(() => db.symptomEntries.orderBy("occurredAt").reverse().toArray(), []) ?? [];

  const grouped: Record<string, SymptomEntry[]> = {};
  for (const e of entries) {
    const key = toDayKey(e.occurredAt);
    grouped[key] = grouped[key] ?? [];
    grouped[key].push(e);
  }

  // keys arrive newest-first because entries are sorted newest-first
  const dayKeys = Object.keys(grouped);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        paddingTop: "calc(env(safe-area-inset-top) + 12px)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 100px)",
        overflow: "auto",
      }}
    >
      <div style={{ padding: "0 24px" }}>
        <div style={{ marginTop: 22, marginBottom: 18 }}>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: 38,
              fontWeight: 400,
              color: p.ink,
              letterSpacing: -0.6,
              lineHeight: 1.02,
            }}
          >
            Your{" "}
            <em style={{ color: p.accent }}>timeline</em>
          </div>
          <div
            style={{
              fontSize: 14,
              color: p.inkSoft,
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {entries.length}{" "}entries &middot; take this to your appointment
          </div>

          {/* view toggle */}
          <div
            style={{
              display: "inline-flex",
              background: p.surfaceAlt,
              borderRadius: 14,
              padding: 3,
              gap: 2,
              border: `1px solid ${p.border}`,
            }}
          >
            {([{ v: "day", label: "Day" }, { v: "month", label: "Month" }] as {
              v: TimelineView;
              label: string;
            }[]).map((o) => {
              const on = view === o.v;
              return (
                <button
                  key={o.v}
                  onClick={() => setView(o.v)}
                  style={{
                    minWidth: 76,
                    height: 34,
                    borderRadius: 11,
                    border: "none",
                    background: on ? p.surface : "transparent",
                    color: on ? p.ink : p.inkSoft,
                    fontWeight: on ? 600 : 500,
                    fontFamily: fontDisplay,
                    fontStyle: on ? "italic" : "normal",
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: on ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        {view === "month" && (
          <CalendarView entries={entries} dark={dark} p={p} cbMode={cbMode} />
        )}

        {view === "day" &&
          dayKeys.map((key) => (
            <div key={key} style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: fontDisplay,
                    fontStyle: "italic",
                    fontSize: 20,
                    color: p.ink,
                    letterSpacing: -0.2,
                  }}
                >
                  {dayLabel(key)}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: p.inkFaint,
                    fontFamily: fontMono,
                    letterSpacing: 0.5,
                  }}
                >
                  {dayDate(key)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {grouped[key].map((e) => (
                  <TimelineRow
                    key={e.id}
                    e={e}
                    dark={dark}
                    p={p}
                    cbMode={cbMode}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
