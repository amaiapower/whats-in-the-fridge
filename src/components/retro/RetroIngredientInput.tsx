"use client";

import { useState, type KeyboardEvent } from "react";
import type { Ingredient } from "@/lib/types";

type Props = {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
};

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `ing-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function RetroIngredientInput({ ingredients, onChange }: Props) {
  const [draft, setDraft] = useState("");
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  function addIngredient() {
    const name = draft.trim().replace(/,$/, "").trim();
    if (!name) return;
    const id = makeId();
    onChange([...ingredients, { id, name, included: true }]);
    setAnimatingIds((prev) => new Set(prev).add(id));
    setTimeout(() => clearAnimating(id), 650);
    setDraft("");
  }

  function clearAnimating(id: string) {
    setAnimatingIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    } else if (e.key === "Backspace" && draft === "" && ingredients.length > 0) {
      onChange(ingredients.slice(0, -1));
    }
  }

  function toggleIngredient(id: string) {
    onChange(
      ingredients.map((i) => (i.id === id ? { ...i, included: !i.included } : i))
    );
  }

  function removeIngredient(id: string) {
    onChange(ingredients.filter((i) => i.id !== id));
  }

  return (
    <div
      className="relative rounded-lg bg-butter border-2 border-ink/10 shadow-sm pt-6 pb-6 px-6 sm:px-8 -rotate-[0.4deg]"
      style={{
        backgroundImage: "linear-gradient(transparent calc(100% - 1.5px), var(--line) calc(100% - 1.5px))",
        backgroundSize: "100% 2.75rem",
        backgroundPositionY: "1.5rem",
      }}
    >
      <div className="absolute left-8 sm:left-10 top-0 bottom-0 w-px bg-rust/30" aria-hidden />

      <div className="pl-4 sm:pl-6">
        <div className="h-11 flex items-end">
          <h2 className="font-retro text-4xl sm:text-5xl text-rust leading-none translate-y-[7px]">
            What&rsquo;s in your fridge?
          </h2>
        </div>
        <div className="h-11 flex items-end pb-1">
          <p className="text-sm text-ink-soft font-body leading-none">
            Jot down what you&rsquo;ve got — tick off what to use.
          </p>
        </div>
        <div className="h-11 flex items-end pb-1">
          <p className="text-xs text-ink-soft/70 font-body italic leading-snug">
            Assumes you&rsquo;ve got neutral oil and a well-stocked spice rack on hand.
          </p>
        </div>
        <div className="h-11 flex items-end pb-1">
          <p className="text-xs text-ink-soft/70 font-body italic leading-snug">
            Unsure if something will work? Add it but leave it unticked — if it works for the
            recipe, we&rsquo;ll add it in!
          </p>
        </div>

        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="group h-11 flex items-end gap-3 pb-1.5">
              <button
                type="button"
                aria-label={ingredient.included ? "Exclude ingredient" : "Include ingredient"}
                onClick={() => toggleIngredient(ingredient.id)}
                className={`flex-none w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-colors cursor-pointer ${
                  ingredient.included
                    ? "bg-mustard border-mustard-dark"
                    : "bg-transparent border-ink/25"
                }`}
              >
                {ingredient.included && (
                  <svg viewBox="0 0 12 10" className="w-2 h-1.5" fill="none">
                    <path
                      d="M1 5L4.5 8.5L11 1"
                      stroke="var(--paper)"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              <span
                onAnimationEnd={() => clearAnimating(ingredient.id)}
                className={`flex-1 font-retro text-2xl leading-none ${
                  ingredient.included ? "text-ink" : "text-ink-soft/50 line-through"
                } ${animatingIds.has(ingredient.id) ? "animate-[handwrite-in_0.6s_ease-out]" : ""}`}
              >
                {ingredient.name}
              </span>

              <button
                type="button"
                aria-label="Remove ingredient"
                onClick={() => removeIngredient(ingredient.id)}
                className="flex-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-ink-soft hover:text-rust transition-opacity cursor-pointer px-1"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="h-11 flex items-end gap-2 pb-0.5">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ingredients.length === 0 ? "e.g. half an onion, 300g mince…" : "add another…"}
            className="flex-1 bg-transparent px-1 font-retro text-2xl leading-none text-ink placeholder:text-ink-soft/50 placeholder:font-body placeholder:text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={addIngredient}
            disabled={!draft.trim()}
            className={`flex-none rounded-md px-3 py-1 mb-0.5 font-retro text-base leading-none transition-colors ${
              draft.trim()
                ? "bg-rust text-paper hover:bg-terracotta-dark cursor-pointer"
                : "bg-line text-ink-soft cursor-not-allowed"
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
