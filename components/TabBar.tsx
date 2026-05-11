"use client";

import type { Screen, ThemePalette } from "@/lib/types";
import { fontDisplay } from "@/lib/theme";
import Icon from "./Icon";

interface TabBarProps {
  screen: Screen;
  setScreen: (s: Screen) => void;
  dark: boolean;
  p: ThemePalette;
}

const tabs: { id: Screen; label: string; icon: string }[] = [
  { id: "log",      label: "Log",      icon: "plus" },
  { id: "timeline", label: "Timeline", icon: "clock" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function TabBar({ screen, setScreen, dark, p }: TabBarProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: "calc(env(safe-area-inset-bottom) + 8px)",
        height: 76,
        background: dark ? "rgba(51,35,29,0.96)" : "rgba(255,255,255,0.94)",
        borderRadius: 26,
        border: `1px solid ${p.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        boxShadow: dark
          ? "0 8px 32px rgba(0,0,0,0.4)"
          : "0 6px 24px rgba(42,53,40,0.06)",
        backdropFilter: "blur(8px)",
        zIndex: 40,
      }}
    >
      {tabs.map(({ id, label, icon }) => {
        const on = screen === id;
        return (
          <button
            key={id}
            onClick={() => setScreen(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: on ? p.accent : p.inkFaint,
              background: "transparent",
              border: "none",
              padding: "10px 0",
              cursor: "pointer",
              minHeight: 56,
            }}
          >
            <Icon name={icon} size={24} stroke={on ? 2.2 : 1.7} />
            <span
              style={{
                fontSize: 12,
                fontFamily: fontDisplay,
                fontStyle: on ? "italic" : "normal",
                letterSpacing: 0.2,
                fontWeight: on ? 500 : 400,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
