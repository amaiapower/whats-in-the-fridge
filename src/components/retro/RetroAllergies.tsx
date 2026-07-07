"use client";

import { useState, type KeyboardEvent } from "react";
import { ALLERGY_PRESETS } from "@/lib/types";
import { CHIP_COLORS } from "./chipColors";

type Props = {
  selectedPresets: string[];
  onTogglePreset: (id: string) => void;
  customEntries: string[];
  onAddCustom: (value: string) => void;
  onRemoveCustom: (value: string) => void;
};

export default function RetroAllergies({
  selectedPresets,
  onTogglePreset,
  customEntries,
  onAddCustom,
  onRemoveCustom,
}: Props) {
  const [showOther, setShowOther] = useState(false);
  const [draft, setDraft] = useState("");

  function addDraft() {
    const value = draft.trim().replace(/,$/, "").trim();
    if (!value) return;
    onAddCustom(value);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addDraft();
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-xs text-ink-soft/70 font-body">Any allergies or preferences?</p>
      <div
        role="group"
        aria-label="Allergies and preferences"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {ALLERGY_PRESETS.map((preset, i) => {
          const active = selectedPresets.includes(preset.id);
          const colorClass = CHIP_COLORS[i % CHIP_COLORS.length];
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onTogglePreset(preset.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 font-retro text-lg leading-none transition-transform cursor-pointer ${
                active
                  ? `${colorClass} scale-105`
                  : "bg-paper text-ink-soft border-ink/10 hover:border-ink/25"
              }`}
            >
              <span aria-hidden>{preset.emoji}</span>
              {preset.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowOther((v) => !v)}
          aria-pressed={showOther}
          className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 font-retro text-lg leading-none transition-transform cursor-pointer ${
            showOther
              ? "bg-ink/10 border-ink/30 text-ink scale-105"
              : "bg-paper text-ink-soft border-ink/10 hover:border-ink/25"
          }`}
        >
          <span aria-hidden>➕</span>
          Other
        </button>
      </div>

      {showOther && (
        <div className="flex flex-col items-center gap-2 mt-1 w-full max-w-sm">
          {customEntries.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1.5">
              {customEntries.map((entry) => (
                <li
                  key={entry}
                  className="inline-flex items-center gap-1.5 rounded-full bg-paper border border-ink/15 pl-3 pr-1.5 py-1 text-xs font-body text-ink"
                >
                  {entry}
                  <button
                    type="button"
                    aria-label={`Remove ${entry}`}
                    onClick={() => onRemoveCustom(entry)}
                    className="text-ink-soft hover:text-rust transition-colors cursor-pointer px-0.5"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2 w-full justify-center">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. sesame, kiwi…"
              className="rounded-lg border border-ink/15 bg-paper px-3 py-1.5 text-sm font-body text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-mustard/50 focus:border-mustard w-48"
            />
            <button
              type="button"
              onClick={addDraft}
              disabled={!draft.trim()}
              className={`flex-none rounded-lg px-3 py-1.5 text-sm font-body font-semibold transition-colors ${
                draft.trim()
                  ? "bg-rust text-paper hover:bg-terracotta-dark cursor-pointer"
                  : "bg-line text-ink-soft cursor-not-allowed"
              }`}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
