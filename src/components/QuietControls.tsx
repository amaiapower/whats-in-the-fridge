"use client";

import { VIBES } from "@/lib/types";

type Props = {
  vibe: string;
  onVibeChange: (vibe: string) => void;
  servings: number;
  onServingsChange: (servings: number) => void;
};

const MIN = 1;
const MAX = 12;

export default function QuietControls({ vibe, onVibeChange, servings, onServingsChange }: Props) {
  function clamp(n: number) {
    return Math.min(MAX, Math.max(MIN, n));
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {VIBES.map((v) => {
          const active = v.id === vibe;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onVibeChange(v.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? "bg-sage/25 text-sage-dark"
                  : "text-ink-soft hover:text-ink hover:bg-cream"
              }`}
            >
              <span aria-hidden className="text-[11px]">
                {v.emoji}
              </span>
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <span>Serves</span>
        <button
          type="button"
          aria-label="Decrease servings"
          onClick={() => onServingsChange(clamp(servings - 1))}
          disabled={servings <= MIN}
          className="w-6 h-6 rounded-full border border-line text-ink-soft hover:border-sage hover:text-sage-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-sm leading-none"
        >
          −
        </button>
        <span className="w-4 text-center font-semibold text-ink tabular-nums">{servings}</span>
        <button
          type="button"
          aria-label="Increase servings"
          onClick={() => onServingsChange(clamp(servings + 1))}
          disabled={servings >= MAX}
          className="w-6 h-6 rounded-full border border-line text-ink-soft hover:border-sage hover:text-sage-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-sm leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
