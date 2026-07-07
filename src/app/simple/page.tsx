"use client";

import { useState } from "react";
import Link from "next/link";
import IngredientInput from "@/components/IngredientInput";
import QuietControls from "@/components/QuietControls";
import QuietHistory from "@/components/QuietHistory";
import RecipeDisplay from "@/components/RecipeDisplay";
import CookingDoodle from "@/components/CookingDoodle";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import type { GeneratedRecipe, Ingredient, SavedRecipe } from "@/lib/types";
import { VIBES } from "@/lib/types";

type View = "form" | "loading" | "result";

export default function SimplePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [vibe, setVibe] = useState(VIBES[0].id);
  const [servings, setServings] = useState(2);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [view, setView] = useState<View>("form");
  const [error, setError] = useState<string | null>(null);

  const { history, addRecipe, removeRecipe } = useRecipeHistory();

  const includedNames = ingredients.filter((i) => i.included).map((i) => i.name);

  async function handleGenerate() {
    if (includedNames.length === 0) {
      setError("Add (and tick) at least one ingredient first.");
      return;
    }
    setError(null);
    setView("loading");
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: includedNames, vibe, servings }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong generating your recipe.");
      }
      const generated = data as GeneratedRecipe;
      setRecipe(generated);
      addRecipe(generated, { ingredients: includedNames, vibe, servings });
      setView("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setView("form");
    }
  }

  function handleSelectHistory(saved: SavedRecipe) {
    setRecipe(saved);
    setError(null);
    setView("result");
  }

  function handleNewRecipe() {
    setRecipe(null);
    setView("form");
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-xl">
        <Link
          href="/"
          className="fixed top-4 left-4 text-xs text-ink-soft/50 hover:text-ink-soft transition-colors"
        >
          ‹ full version
        </Link>
        <Link
          href="/retro"
          className="fixed top-4 right-4 text-xs text-ink-soft/50 hover:text-ink-soft transition-colors"
        >
          retro version ›
        </Link>

        {view === "loading" && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 animate-[fadein-slow_.4s_ease]">
            <CookingDoodle />
            <p className="font-hand text-2xl text-terracotta-dark">Stirring something up…</p>
            <p className="text-sm text-ink-soft">Searching for inspiration and writing something original.</p>
          </div>
        )}

        {view === "form" && (
          <div className="animate-[fadein-slow_.4s_ease] space-y-6">
            <IngredientInput ingredients={ingredients} onChange={setIngredients} />

            <QuietControls
              vibe={vibe}
              onVibeChange={setVibe}
              servings={servings}
              onServingsChange={setServings}
            />

            <div className="text-center">
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-2xl bg-terracotta px-10 py-3.5 text-lg font-bold text-paper shadow-sm hover:bg-terracotta-dark transition-colors cursor-pointer"
              >
                Generate recipe
              </button>
              {error && <p className="mt-2 text-sm text-terracotta-dark">{error}</p>}
            </div>

            <QuietHistory history={history} onSelect={handleSelectHistory} onRemove={removeRecipe} />
          </div>
        )}

        {view === "result" && recipe && (
          <div className="animate-[fadein-slow_.4s_ease] space-y-4">
            <button
              type="button"
              onClick={handleNewRecipe}
              className="text-sm text-ink-soft hover:text-terracotta-dark transition-colors cursor-pointer"
            >
              ‹ New recipe
            </button>
            <RecipeDisplay recipe={recipe} />
          </div>
        )}
      </div>
    </div>
  );
}
