"use client";

import { useState } from "react";
import type { ThemePalette, CbMode } from "@/lib/types";
import type { SymptomEntry } from "@/lib/db/types";
import { fontDisplay, fontBody, fontMono } from "@/lib/theme";
import TimelineRow from "./TimelineRow";

interface CalendarViewProps {
  entries: SymptomEntry[];
  dark: boolean;
  p: ThemePalette;
  cbMode: CbMode;
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function sameYMD(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const SEV_RANK: Record<string, number> = { mild: 1, bad: 2, terrible: 3 };

export default function CalendarView({
  entries,
  dark,
  p,
  cbMode,
}: CalendarViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(today));
  const [selectedKey, setSelectedKey] = useState(() => ymd(today));

  const byDay: Record<string, SymptomEntry[]> = {};
  for (const e of entries) {
    const k = ymd(new Date(e.occurredAt));
    byDay[k] = byDay[k] ?? [];
    byDay[k].push(e);
  }

  const month = viewMonth;
  const monthLabel = month.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const firstDow = month.getDay();
  const dim = daysInMonth(month);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++)
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);

  const goPrev = () =>
    setViewMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const goNext = () =>
    setViewMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  const dayWeight = (es: SymptomEntry[]) =>
    Math.max(0, ...es.map((e) => SEV_RANK[e.severity] ?? 0));

  const selectedDayEntries = byDay[selectedKey] ?? [];
  const [sy, sm, sd] = selectedKey.split("-").map(Number);
  const selDate = new Date(sy, sm, sd);

  const navBtnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 12,
    background: p.surfaceAlt,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: p.ink,
  };

  return (
    <div>
      {/* month header + nav */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
        <button onClick={goPrev} style={navBtnStyle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={p.ink}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: fontDisplay,
            fontSize: 22,
            fontWeight: 500,
            color: p.ink,
            letterSpacing: -0.3,
          }}
        >
          <em style={{ fontStyle: "italic" }}>{monthLabel}</em>
        </div>
        <button onClick={goNext} style={navBtnStyle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={p.ink}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* day-of-week labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginBottom: 6,
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: 10,
              letterSpacing: 1.2,
              color: p.inkFaint,
              fontWeight: 600,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
        }}
      >
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} style={{ aspectRatio: "1 / 1" }} />;
          const k = ymd(cell);
          const isToday = sameYMD(cell, today);
          const isFuture = cell > today;
          const isSelected = k === selectedKey;
          const es = byDay[k] ?? [];
          const w = dayWeight(es);
          return (
            <CalendarCell
              key={i}
              date={cell}
              entries={es}
              weight={w}
              isToday={isToday}
              isFuture={isFuture}
              isSelected={isSelected}
              onClick={() => setSelectedKey(k)}
              dark={dark}
              p={p}
              cbMode={cbMode}
            />
          );
        })}
      </div>

      {/* selected day drilldown */}
      <div style={{ marginTop: 22 }}>
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
            {sameYMD(selDate, today)
              ? "Today"
              : selDate.toLocaleDateString(undefined, { weekday: "long" })}
          </div>
          <div
            style={{
              fontSize: 11,
              color: p.inkFaint,
              fontFamily: fontMono,
              letterSpacing: 0.5,
            }}
          >
            {selDate
              .toLocaleDateString(undefined, { month: "short", day: "numeric" })
              .toUpperCase()}
          </div>
        </div>

        {selectedDayEntries.length === 0 ? (
          <div
            style={{
              background: p.surface,
              borderRadius: 18,
              padding: "22px 18px",
              border: `1px solid ${p.border}`,
              textAlign: "center",
              fontFamily: fontDisplay,
              fontStyle: "italic",
              fontSize: 16,
              color: p.inkSoft,
            }}
          >
            Nothing logged.
            <br />
            <span
              style={{
                fontSize: 13,
                color: p.inkFaint,
                fontStyle: "normal",
                fontFamily: fontBody,
              }}
            >
              A quiet day, or one you didn&apos;t track.
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {selectedDayEntries.map((e) => (
              <TimelineRow key={e.id} e={e} dark={dark} p={p} cbMode={cbMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarCell({
  date,
  entries,
  weight,
  isToday,
  isFuture,
  isSelected,
  onClick,
  dark,
  p,
  cbMode,
}: {
  date: Date;
  entries: SymptomEntry[];
  weight: number;
  isToday: boolean;
  isFuture: boolean;
  isSelected: boolean;
  onClick: () => void;
  dark: boolean;
  p: ThemePalette;
  cbMode: CbMode;
}) {
  const tintLight = [
    "transparent",
    "rgba(91,117,72,0.10)",
    "rgba(232,200,96,0.40)",
    "rgba(184,119,90,0.50)",
  ];
  const tintDark = [
    "transparent",
    "rgba(167,194,133,0.16)",
    "rgba(232,200,96,0.30)",
    "rgba(217,104,70,0.45)",
  ];
  const hcLight = ["transparent", "#ebe5d3", "#e8c860", "#2a3528"];
  const hcDark = ["transparent", "#3d2a23", "#f0a868", "#f5e4cd"];

  const useHC = cbMode === "highcontrast";
  const bg = useHC
    ? (dark ? hcDark : hcLight)[weight]
    : (dark ? tintDark : tintLight)[weight];

  const dayNumColor =
    useHC && weight >= 3
      ? dark
        ? "#241814"
        : "#fff"
      : isFuture
        ? p.inkFaint
        : weight > 0
          ? p.ink
          : p.inkSoft;

  return (
    <button
      onClick={onClick}
      disabled={isFuture}
      style={{
        aspectRatio: "1 / 1",
        borderRadius: 12,
        position: "relative",
        background: bg,
        border: isSelected
          ? `2px solid ${p.accent}`
          : `1px solid ${weight > 0 && !useHC ? p.border : "transparent"}`,
        padding: 0,
        cursor: isFuture ? "default" : "pointer",
        opacity: isFuture ? 0.35 : 1,
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: isToday ? 700 : 500,
          color: dayNumColor,
          fontFamily: fontBody,
          lineHeight: 1,
        }}
      >
        {isToday ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: 99,
              background: p.accent,
              color: dark ? "#1a1208" : "#fff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {date.getDate()}
          </span>
        ) : (
          date.getDate()
        )}
      </div>
      {weight > 0 && (
        <div
          style={{
            display: "flex",
            gap: 2,
            height: 4,
            opacity: useHC ? 0 : 1,
          }}
        >
          {Array.from({ length: Math.min(entries.length, 3) }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: 99,
                background: dark
                  ? "rgba(245,228,205,0.7)"
                  : "rgba(42,53,40,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
