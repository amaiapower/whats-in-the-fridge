"use client";

import { VIBES } from "@/lib/types";

type Props = {
  value: string;
  onChange: (vibe: string) => void;
};

export default function VibeSelector({ value, onChange }: Props) {
  return (
    <div className="rounded-3xl bg-paper border border-line shadow-sm p-6 sm:p-7">
      <h2 className="font-hand text-3xl text-terracotta-dark mb-1">Pick a vibe</h2>
      <p className="text-sm text-ink-soft mb-4">What kind of meal are we making?</p>

      <div className="flex flex-wrap gap-2.5">
        {VIBES.map((vibe) => {
          const active = vibe.id === value;
          return (
            <button
              key={vibe.id}
              type="button"
              onClick={() => onChange(vibe.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? "bg-sage border-sage-dark text-paper"
                  : "bg-cream border-line text-ink hover:border-sage"
              }`}
            >
              <span aria-hidden>{vibe.emoji}</span>
              {vibe.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
