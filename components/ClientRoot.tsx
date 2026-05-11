"use client";

import dynamic from "next/dynamic";

const SymptomTracker = dynamic(() => import("./SymptomTracker"), {
  ssr: false,
});

export default function ClientRoot() {
  return <SymptomTracker />;
}
