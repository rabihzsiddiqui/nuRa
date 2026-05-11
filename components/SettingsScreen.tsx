"use client";

import type { ThemePalette, CbMode, AppSettings, DarkModeAuto } from "@/lib/types";
import { fontDisplay, fontBody, getSevStyle } from "@/lib/theme";
import SevDots from "./SevDots";

function fmt(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h < 12 ? "am" : "pm";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, "0")}${period}`;
}

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  dark: boolean;
  p: ThemePalette;
}

export default function SettingsScreen({
  settings,
  onUpdate,
  dark,
  p,
}: SettingsScreenProps) {
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
        <div style={{ marginTop: 22, marginBottom: 22 }}>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: 38,
              fontWeight: 400,
              color: p.ink,
              letterSpacing: -0.6,
            }}
          >
            <em style={{ color: p.accent }}>Settings</em>
          </div>
          <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 8 }}>
            Make it work for your body, today.
          </div>
        </div>

        <SectionLabel p={p}>APPEARANCE</SectionLabel>

        <DarkModeSection settings={settings} onUpdate={onUpdate} p={p} />

        <Row p={p} label="Text size" sub="Larger if reading is hard right now.">
          <Segmented
            options={[
              { v: 0.9, label: "S" },
              { v: 1, label: "M" },
              { v: 1.1, label: "L" },
            ]}
            value={settings.textScale}
            onChange={(v) => onUpdate({ textScale: v })}
            p={p}
          />
        </Row>

        <Row p={p} label="Warmth" sub="Adjusts the ambient background tint.">
          <Segmented
            options={[
              { v: 0.7, label: "Cool" },
              { v: 1, label: "Soft" },
              { v: 1.3, label: "Warm" },
            ]}
            value={settings.warmth}
            onChange={(v) => onUpdate({ warmth: v })}
            p={p}
          />
        </Row>

        <SectionLabel p={p}>ACCESSIBILITY</SectionLabel>

        {([
          {
            id: "off",
            title: "Color only",
            sub: "Default. Color-coded severity.",
          },
          {
            id: "patterns",
            title: "Color + dots",
            sub: "Blue, amber, purple palette with dot indicators. Safe for red-green CVD.",
          },
          {
            id: "highcontrast",
            title: "High contrast",
            sub: "Luminance ramp instead of hue. Strong borders. Works for any color vision.",
          },
        ] as { id: CbMode; title: string; sub: string }[]).map((opt) => (
          <CBOption
            key={opt.id}
            id={opt.id}
            active={settings.cbMode === opt.id}
            onClick={() => onUpdate({ cbMode: opt.id })}
            title={opt.title}
            sub={opt.sub}
            dark={dark}
            p={p}
          />
        ))}

        <div
          style={{
            marginTop: 22,
            marginBottom: 8,
            padding: "16px 18px",
            background: p.surfaceAlt,
            borderRadius: 18,
            fontFamily: fontDisplay,
            fontStyle: "italic",
            fontSize: 14,
            color: p.inkSoft,
            lineHeight: 1.4,
          }}
        >
          Data stays on this device. No account. No sharing.
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, p }: { children: React.ReactNode; p: ThemePalette }) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: 1.6,
        color: p.inkFaint,
        fontWeight: 600,
        marginTop: 26,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  sub,
  children,
  p,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
  p: ThemePalette;
}) {
  return (
    <div
      style={{
        background: p.surface,
        borderRadius: 18,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
        border: `1px solid ${p.border}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fontDisplay,
            fontSize: 18,
            fontWeight: 500,
            color: p.ink,
            letterSpacing: -0.2,
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 12,
              color: p.inkSoft,
              marginTop: 3,
              lineHeight: 1.3,
            }}
          >
            {sub}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}


function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  p,
}: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  p: ThemePalette;
}) {
  return (
    <div
      style={{
        display: "flex",
        background: p.surfaceAlt,
        borderRadius: 12,
        padding: 3,
        gap: 2,
        flexShrink: 0,
      }}
    >
      {options.map((o) => {
        const on = value === o.v;
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            style={{
              minWidth: 36,
              height: 30,
              borderRadius: 9,
              border: "none",
              background: on ? p.surface : "transparent",
              color: on ? p.ink : p.inkSoft,
              fontWeight: on ? 600 : 500,
              fontFamily: fontBody,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: on ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function DarkModeSection({
  settings,
  onUpdate,
  p,
}: {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  p: ThemePalette;
}) {
  const isAuto = settings.darkModeAuto !== "off";
  const isCustom = settings.darkModeAuto === "custom";
  const modeKey: string = isAuto ? "auto" : settings.darkMode ? "dark" : "light";

  const handleMode = (v: string) => {
    if (v === "light") onUpdate({ darkMode: false, darkModeAuto: "off" });
    else if (v === "dark") onUpdate({ darkMode: true, darkModeAuto: "off" });
    else onUpdate({ darkModeAuto: settings.darkModeAuto === "off" ? "default" : settings.darkModeAuto });
  };

  const sub = isCustom
    ? `Switches at ${fmt(settings.darkModeStart)}, off at ${fmt(settings.darkModeEnd)}.`
    : isAuto
    ? "Lights on at 6am, lights off at 8pm."
    : settings.darkMode
    ? "Currently dark."
    : "Currently light.";

  return (
    <>
      <Row p={p} label="Dark mode" sub={sub}>
        <Segmented
          options={[
            { v: "light", label: "Light" },
            { v: "dark",  label: "Dark"  },
            { v: "auto",  label: "Auto"  },
          ]}
          value={modeKey}
          onChange={handleMode}
          p={p}
        />
      </Row>

      {isAuto && (
        <Row p={p} label="Schedule" sub="When dark mode activates.">
          <Segmented
            options={[
              { v: "default", label: "8pm–7am" },
              { v: "custom",  label: "Custom"  },
            ]}
            value={isCustom ? "custom" : "default"}
            onChange={(v) => onUpdate({ darkModeAuto: v as DarkModeAuto })}
            p={p}
          />
        </Row>
      )}

      {isCustom && (
        <>
          <TimeRow
            label="Turn dark at"
            value={settings.darkModeStart}
            onChange={(v) => onUpdate({ darkModeStart: v })}
            p={p}
          />
          <TimeRow
            label="Turn light at"
            value={settings.darkModeEnd}
            onChange={(v) => onUpdate({ darkModeEnd: v })}
            p={p}
          />
        </>
      )}
    </>
  );
}

function TimeRow({
  label,
  value,
  onChange,
  p,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  p: ThemePalette;
}) {
  return (
    <div
      style={{
        background: p.surface,
        borderRadius: 18,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
        border: `1px solid ${p.border}`,
      }}
    >
      <div
        style={{
          flex: 1,
          fontFamily: fontDisplay,
          fontSize: 17,
          fontWeight: 500,
          color: p.ink,
          letterSpacing: -0.2,
        }}
      >
        {label}
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: p.surfaceAlt,
          border: `1px solid ${p.border}`,
          borderRadius: 10,
          padding: "7px 10px",
          color: p.ink,
          fontFamily: fontBody,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          outline: "none",
          colorScheme: "inherit",
        }}
      />
    </div>
  );
}

function CBOption({
  id,
  active,
  onClick,
  title,
  sub,
  dark,
  p,
}: {
  id: CbMode;
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  dark: boolean;
  p: ThemePalette;
}) {
  const levels = ["mild", "bad", "terrible"] as const;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: p.surface,
        borderRadius: 18,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
        border: active
          ? `2px solid ${p.accent}`
          : `1px solid ${p.border}`,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 99,
          border: `2px solid ${active ? p.accent : p.borderStrong}`,
          background: active ? p.accent : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {active && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              background: "#fff",
            }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fontDisplay,
            fontSize: 17,
            fontWeight: 500,
            color: p.ink,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: p.inkSoft,
            marginTop: 3,
            lineHeight: 1.3,
          }}
        >
          {sub}
        </div>
      </div>

      {/* preview chips */}
      <div style={{ display: "flex", gap: 4 }}>
        {levels.map((lv) => {
          const st = getSevStyle({
            level: lv,
            dark,
            cbMode: id,
            variant: "button",
          });
          return (
            <div
              key={lv}
              style={{
                width: 30,
                height: 22,
                borderRadius: 7,
                background: st.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                border:
                  id === "highcontrast"
                    ? `1.5px solid ${st.border}`
                    : `1px solid ${p.border}`,
              }}
            >
              {st.showDots && (
                <SevDots level={lv} color={st.dotColor} size={3} gap={1.5} />
              )}
            </div>
          );
        })}
      </div>
    </button>
  );
}
