"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { ThemePalette } from "@/lib/types";
import { fontDisplay } from "@/lib/theme";
import { db } from "@/lib/db/database";
import Icon from "./Icon";

interface HomeScreenProps {
  onOpenModal: (sid: string) => void;
  dark: boolean;
  p: ThemePalette;
  savedFlash: boolean;
}

export default function HomeScreen({ onOpenModal, dark, p, savedFlash }: HomeScreenProps) {
  const symptoms =
    useLiveQuery(async () => {
      const all = await db.symptoms.toArray();
      return all.filter((s) => !s.isArchived).sort((a, b) => a.position - b.position);
    }, []) ?? [];

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
        <div style={{ marginTop: 22, marginBottom: 26 }}>
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
            How are you,
            <br />
            <em style={{ fontStyle: "italic", color: p.accent }}>today?</em>
          </div>
          <div style={{ fontSize: 15, color: p.inkSoft, marginTop: 10 }}>
            Take your time. Tap to log.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {symptoms.map((s) => (
            <SymptomTile
              key={s.id}
              id={s.id}
              label={s.name}
              onClick={() => onOpenModal(s.id)}
              dark={dark}
              p={p}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 22,
            textAlign: "center",
            fontSize: 13,
            color: p.inkSoft,
            fontFamily: fontDisplay,
            fontStyle: "italic",
            opacity: 0.75,
          }}
        >
          — there&apos;s no wrong answer —
        </div>
      </div>

      {savedFlash && (
        <div
          className="saved-flash"
          style={{
            position: "absolute",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
            background: p.accent,
            color: dark ? "#1a1208" : "#fff",
            padding: "10px 20px",
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: fontDisplay,
            fontStyle: "italic",
            letterSpacing: 0.2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            zIndex: 30,
            whiteSpace: "nowrap",
          }}
        >
          Saved &middot; gently noted
        </div>
      )}
    </div>
  );
}

function SymptomTile({
  id,
  label,
  onClick,
  dark,
  p,
}: {
  id: string;
  label: string;
  onClick: () => void;
  dark: boolean;
  p: ThemePalette;
}) {
  const [pressed, setPressed] = useState(false);
  const tone = p.tileTones[id] ?? { bg: p.surfaceAlt, ink: p.ink };

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        borderRadius: 28,
        background: tone.bg,
        padding: "20px 20px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: 132,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${dark ? "rgba(245,228,205,0.06)" : "rgba(42,53,40,0.04)"}`,
        cursor: "pointer",
        textAlign: "left",
        color: tone.ink,
        fontFamily: "inherit",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "transform 120ms ease, box-shadow 120ms ease",
      }}
    >
      {/* decorative leaf */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        style={{ position: "absolute", right: -6, bottom: -6, opacity: 0.12 }}
      >
        <path
          d="M4 20s2-7 8-12c4-3 8-3 8-3s0 4-3 8c-5 6-12 8-12 8z"
          fill={tone.ink}
        />
      </svg>
      <Icon name={id} size={32} stroke={1.8} color={tone.ink} />
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: 24,
          fontWeight: 500,
          color: tone.ink,
          letterSpacing: -0.4,
          lineHeight: 1,
        }}
      >
        {label}
      </div>
    </button>
  );
}
