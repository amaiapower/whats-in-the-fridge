"use client";

type Props = {
  value: number;
  onChange: (servings: number) => void;
};

const MIN = 1;
const MAX = 12;

export default function ServingsInput({ value, onChange }: Props) {
  function clamp(n: number) {
    return Math.min(MAX, Math.max(MIN, n));
  }

  return (
    <div className="rounded-3xl bg-paper border border-line shadow-sm p-6 sm:p-7">
      <h2 className="font-hand text-3xl text-terracotta-dark mb-1">Cooking for how many?</h2>
      <p className="text-sm text-ink-soft mb-4">We&rsquo;ll scale the recipe to fit.</p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Decrease servings"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= MIN}
          className="w-11 h-11 rounded-full border border-line bg-cream text-xl font-bold text-terracotta-dark hover:bg-sage/20 hover:border-sage transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          −
        </button>

        <div className="flex flex-col items-center min-w-16">
          <span className="font-hand text-5xl leading-none text-ink">{value}</span>
          <span className="text-xs text-ink-soft mt-1">
            {value === 1 ? "person" : "people"}
          </span>
        </div>

        <button
          type="button"
          aria-label="Increase servings"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= MAX}
          className="w-11 h-11 rounded-full border border-line bg-cream text-xl font-bold text-terracotta-dark hover:bg-sage/20 hover:border-sage transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
