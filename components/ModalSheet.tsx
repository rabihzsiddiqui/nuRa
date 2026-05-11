"use client";

import { useState, useEffect } from "react";
import type { ThemePalette, CbMode, SeverityLevel } from "@/lib/types";
import { fontDisplay, fontBody, getSevStyle } from "@/lib/theme";
import { SYMPTOM_BY_ID } from "@/lib/symptoms";
import Icon from "./Icon";
import SevDots from "./SevDots";

interface ModalSheetProps {
  open: boolean;
  sid: string | null;
  dark: boolean;
  p: ThemePalette;
  cbMode: CbMode;
  onClose: (didSave?: boolean) => void;
  onSave: (data: { sid: string; sev: SeverityLevel; note: string }) => void;
}

export default function ModalSheet({
  open,
  sid,
  dark,
  p,
  cbMode,
  onClose,
  onSave,
}: ModalSheetProps) {
  const [sev, setSev] = useState<SeverityLevel>("bad");
  const [note, setNote] = useState("");
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setSev("bad");
      setNote("");
      setClosing(false);
    }
  }, [open, sid]);

  if (!open && !closing) return null;
  if (!sid) return null;
  const s = SYMPTOM_BY_ID[sid];
  if (!s) return null;

  const tone = p.tileTones[sid] ?? { bg: p.surfaceAlt, ink: p.ink };
  const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  };

  const save = () => {
    onSave({ sid, sev, note });
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose(true);
    }, 220);
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={close}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          background: dark ? "rgba(0,0,0,0.45)" : "rgba(42,53,40,0.22)",
          opacity: closing ? 0 : 1,
          transition: "opacity 220ms ease",
        }}
      />
      {/* sheet */}
      <div
        className={closing ? "" : "sheet-up"}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          background: p.surface,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          padding: "14px 24px calc(30px + env(safe-area-inset-bottom))",
          boxShadow: "0 -12px 40px rgba(0,0,0,0.20)",
          transform: closing ? "translateY(100%)" : "translateY(0)",
          transition: closing
            ? "transform 220ms cubic-bezier(0.5, 0, 0.75, 0)"
            : undefined,
        }}
      >
        {/* drag handle */}
        <div
          style={{
            width: 44,
            height: 5,
            borderRadius: 3,
            background: dark
              ? "rgba(245,228,205,0.18)"
              : "rgba(42,53,40,0.18)",
            margin: "0 auto 18px",
          }}
        />

        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: tone.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name={sid} size={28} stroke={1.8} color={tone.ink} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: fontDisplay,
                fontSize: 28,
                fontWeight: 500,
                color: p.ink,
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 13,
                color: p.inkSoft,
                marginTop: 4,
                fontFamily: fontBody,
              }}
            >
              right now &middot; {now}
            </div>
          </div>
          <button
            onClick={close}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: p.surfaceAlt,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: p.inkSoft,
            }}
          >
            <Icon name="x" size={18} stroke={2} />
          </button>
        </div>

        {/* severity label */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: 1.5,
            color: p.inkSoft,
            margin: "20px 0 10px",
            fontFamily: fontBody,
            fontWeight: 600,
          }}
        >
          HOW BAD IS IT?
        </div>

        {/* severity buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {(["mild", "bad", "terrible"] as SeverityLevel[]).map((level) => {
            const active = sev === level;
            const st = getSevStyle({
              level,
              dark,
              cbMode,
              variant: active ? "buttonActive" : "button",
            });
            return (
              <button
                key={level}
                onClick={() => setSev(level)}
                style={{
                  flex: 1,
                  height: 64,
                  borderRadius: 18,
                  background: st.bg,
                  color: st.ink,
                  border:
                    cbMode === "highcontrast"
                      ? `2px solid ${st.border}`
                      : `1px solid ${active ? "transparent" : p.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: fontDisplay,
                  fontSize: 19,
                  fontWeight: 500,
                  fontStyle: active ? "italic" : "normal",
                  letterSpacing: -0.2,
                  cursor: "pointer",
                  transition: "all 120ms ease",
                }}
              >
                <span>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
                {st.showDots && (
                  <SevDots
                    level={level}
                    color={st.dotColor}
                    size={6}
                    gap={3}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* note label */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: 1.5,
            color: p.inkSoft,
            marginBottom: 10,
            fontFamily: fontBody,
            fontWeight: 600,
          }}
        >
          NOTE &middot; OPTIONAL
        </div>

        {/* note input */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything to remember…"
          rows={2}
          style={{
            display: "block",
            width: "100%",
            resize: "none",
            background: p.surfaceAlt,
            borderRadius: 16,
            padding: "14px 16px",
            fontSize: 15,
            color: p.ink,
            marginBottom: 22,
            fontFamily: fontDisplay,
            fontStyle: "italic",
            border: `1px solid ${p.border}`,
            outline: "none",
            minHeight: 56,
          }}
        />

        {/* actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={close}
            style={{
              flex: 1,
              height: 60,
              borderRadius: 18,
              background: "transparent",
              border: `1px solid ${p.borderStrong}`,
              fontFamily: fontDisplay,
              fontSize: 19,
              color: p.inkSoft,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{
              flex: 1.6,
              height: 60,
              borderRadius: 18,
              background: p.accent,
              color: dark ? "#1a1208" : "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: fontDisplay,
              fontSize: 19,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <span>Save</span>
            <Icon
              name="leaf"
              size={18}
              stroke={2}
              color={dark ? "#1a1208" : "#fff"}
            />
          </button>
        </div>
      </div>
    </>
  );
}
