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

export default function IngredientInput({ ingredients, onChange }: Props) {
  const [draft, setDraft] = useState("");

  function addIngredient() {
    const name = draft.trim().replace(/,$/, "").trim();
    if (!name) return;
    onChange([...ingredients, { id: makeId(), name, included: true }]);
    setDraft("");
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
    <div className="rounded-3xl bg-paper border border-line shadow-sm p-6 sm:p-7">
      <h2 className="font-hand text-3xl text-terracotta-dark mb-1">
        What&rsquo;s in your fridge?
      </h2>
      <p className="text-sm text-ink-soft mb-4">
        Type an ingredient and hit enter. Untick anything you&rsquo;d rather leave out.
      </p>

      <ul className="mb-3">
        {ingredients.map((ingredient, idx) => (
          <li
            key={ingredient.id}
            className="group flex items-center gap-3 py-2 border-b border-dashed border-line last:border-b-0 animate-[fadein_.2s_ease]"
          >
            <button
              type="button"
              aria-label={ingredient.included ? "Exclude ingredient" : "Include ingredient"}
              onClick={() => toggleIngredient(ingredient.id)}
              className={`flex-none w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
                ingredient.included
                  ? "bg-sage border-sage-dark"
                  : "bg-transparent border-line"
              }`}
            >
              {ingredient.included && (
                <svg viewBox="0 0 12 10" className="w-3 h-2.5" fill="none">
                  <path
                    d="M1 5L4.5 8.5L11 1"
                    stroke="#FFFDF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <span className="flex-none text-xs text-ink-soft font-body w-4 text-right tabular-nums">
              {idx + 1}.
            </span>

            <span
              className={`flex-1 text-base ${
                ingredient.included ? "text-ink" : "text-ink-soft/60 line-through"
              }`}
            >
              {ingredient.name}
            </span>

            <button
              type="button"
              aria-label="Remove ingredient"
              onClick={() => removeIngredient(ingredient.id)}
              className="flex-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-ink-soft hover:text-terracotta-dark transition-opacity cursor-pointer px-1"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ingredients.length === 0 ? "e.g. half an onion, 300g mince…" : "add another…"}
          className="flex-1 rounded-xl border border-line bg-cream px-4 py-2.5 text-base text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage"
        />
        <button
          type="button"
          onClick={addIngredient}
          disabled={!draft.trim()}
          className="flex-none rounded-xl bg-terracotta px-4 py-2.5 text-paper font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
}
