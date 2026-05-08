"use client";

import GlitchText from "@/components/GlitchText";

export default function SelectedWorkLabel() {
  return (
    <div className="px-4 md:px-6 pb-6">
      <GlitchText
        text="Selected Work"
        className="text-[11px] tracking-[0.2em] uppercase text-[#888880]"
      />
    </div>
  );
}
