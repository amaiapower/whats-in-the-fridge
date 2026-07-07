"use client";

import { VIBES, DISH_TYPES, type Vibe } from "@/lib/types";
import { CHIP_COLORS } from "./chipColors";

type Props = {
  dishType: string;
  onDishTypeChange: (dishType: string) => void;
  vibes: string[];
  onToggleVibe: (vibeId: string) => void;
  spiceLevel: number;
  onSpiceLevelChange: (level: number) => void;
  saltLevel: number;
  onSaltLevelChange: (level: number) => void;
  sweetLevel: number;
  onSweetLevelChange: (level: number) => void;
  servings: number;
  onServingsChange: (servings: number) => void;
};

const MIN = 1;
const MAX = 12;

const EXTRA_RETRO_VIBES: Vibe[] = [
  { id: "nostalgic", label: "Nostalgic", emoji: "📻" },
  { id: "indulgent", label: "Indulgent", emoji: "🍫" },
  { id: "meal-prep", label: "Meal Prep", emoji: "🥡" },
];

export const RETRO_VIBES: Vibe[] = [
  ...VIBES.filter((v) => v.id !== "snack" && v.id !== "spicy"),
  ...EXTRA_RETRO_VIBES,
];

export default function RetroControls({
  dishType,
  onDishTypeChange,
  vibes,
  onToggleVibe,
  spiceLevel,
  onSpiceLevelChange,
  saltLevel,
  onSaltLevelChange,
  sweetLevel,
  onSweetLevelChange,
  servings,
  onServingsChange,
}: Props) {
  function clamp(n: number) {
    return Math.min(MAX, Math.max(MIN, n));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <ChipRow
        options={DISH_TYPES}
        selected={[dishType]}
        onToggle={onDishTypeChange}
        srLabel="Dish type"
        subtitle="What kind of dish?"
      />

      <ChipRow
        options={RETRO_VIBES}
        selected={vibes}
        onToggle={onToggleVibe}
        srLabel="Vibe"
        subtitle="Pick a vibe (or a few)"
      />

      <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-3">
        <LevelPicker
          label="How spicy?"
          emoji="🌶️"
          level={spiceLevel}
          onChange={onSpiceLevelChange}
          srLabel="Spice level"
        />
        <LevelPicker
          label="How salty?"
          emoji="🧂"
          level={saltLevel}
          onChange={onSaltLevelChange}
          srLabel="Salt level"
        />
        <LevelPicker
          label="How sweet?"
          emoji="🍬"
          level={sweetLevel}
          onChange={onSweetLevelChange}
          srLabel="Sweetness level"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <span className="font-retro text-lg text-ink-soft">Serves</span>
        <button
          type="button"
          aria-label="Decrease servings"
          onClick={() => onServingsChange(clamp(servings - 1))}
          disabled={servings <= MIN}
          className="w-8 h-8 rounded-full border-2 border-ink/15 bg-paper text-rust font-bold hover:border-mustard hover:text-mustard-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          −
        </button>
        <span className="font-retro text-2xl text-ink w-6 text-center">{servings}</span>
        <button
          type="button"
          aria-label="Increase servings"
          onClick={() => onServingsChange(clamp(servings + 1))}
          disabled={servings >= MAX}
          className="w-8 h-8 rounded-full border-2 border-ink/15 bg-paper text-rust font-bold hover:border-mustard hover:text-mustard-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}

function LevelPicker({
  label,
  emoji,
  level,
  onChange,
  srLabel,
}: {
  label: string;
  emoji: string;
  level: number;
  onChange: (level: number) => void;
  srLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-xs text-ink-soft/70 font-body">{label}</p>
      <div role="group" aria-label={srLabel} className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= level;
          return (
            <button
              key={n}
              type="button"
              aria-label={`${srLabel} ${n} out of 5`}
              aria-pressed={active}
              onClick={() => onChange(level === n ? n - 1 : n)}
              className={`text-xl leading-none transition-opacity cursor-pointer ${
                active ? "opacity-100" : "opacity-20 grayscale"
              }`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type ChipOption = { id: string; label: string; emoji: string };

function ChipRow({
  options,
  selected,
  onToggle,
  srLabel,
  subtitle,
}: {
  options: ChipOption[];
  selected: string[];
  onToggle: (id: string) => void;
  srLabel: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-xs text-ink-soft/70 font-body">{subtitle}</p>
      <div
        role="group"
        aria-label={srLabel}
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {options.map((option, i) => {
          const active = selected.includes(option.id);
          const colorClass = CHIP_COLORS[i % CHIP_COLORS.length];
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 font-retro text-lg leading-none transition-transform cursor-pointer ${
                active
                  ? `${colorClass} scale-105`
                  : "bg-paper text-ink-soft border-ink/10 hover:border-ink/25"
              }`}
            >
              <span aria-hidden>{option.emoji}</span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
