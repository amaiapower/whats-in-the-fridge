"use client";

import { useEffect, useState } from "react";
import RetroIngredientInput from "@/components/retro/RetroIngredientInput";
import RetroControls, { RETRO_VIBES } from "@/components/retro/RetroControls";
import RetroAllergies from "@/components/retro/RetroAllergies";
import RetroHistory from "@/components/retro/RetroHistory";
import RetroRecipeDisplay from "@/components/retro/RetroRecipeDisplay";
import { FryingPan, PanSmoke } from "@/components/retro/FryingPanDoodle";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import type { GeneratedRecipe, Ingredient, SavedRecipe } from "@/lib/types";
import { DISH_TYPES, ALLERGY_PRESETS } from "@/lib/types";

type View = "form" | "loading" | "result";

const LOADING_MESSAGES = [
  "Rummaging around the fridge…",
  "Chopping everything up…",
  "Heating up the pan…",
  "Getting it all sizzling…",
  "Plating things up…",
  "Adding a little garnish…",
];

const STAGE_INTERVAL_MS = 5500;
const FADE_MS = 350;

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dishType, setDishType] = useState(DISH_TYPES[0].id);
  const [vibes, setVibes] = useState<string[]>([RETRO_VIBES[0].id]);
  const [spiceLevel, setSpiceLevel] = useState(0);
  const [saltLevel, setSaltLevel] = useState(0);
  const [sweetLevel, setSweetLevel] = useState(0);
  const [allergyPresets, setAllergyPresets] = useState<string[]>([]);
  const [customAllergies, setCustomAllergies] = useState<string[]>([]);
  const [servings, setServings] = useState(2);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [view, setView] = useState<View>("form");
  const [stageIndex, setStageIndex] = useState(0);
  const [stageVisible, setStageVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { history, addRecipe, removeRecipe } = useRecipeHistory();

  const includedNames = ingredients.filter((i) => i.included).map((i) => i.name);

  useEffect(() => {
    if (view !== "loading") return;
    let index = 0;
    setStageIndex(0);
    setStageVisible(true);
    let fadeTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      if (index >= LOADING_MESSAGES.length - 1) {
        // hold on the final message rather than looping back to the start
        clearInterval(interval);
        return;
      }
      setStageVisible(false);
      fadeTimeout = setTimeout(() => {
        index += 1;
        setStageIndex(index);
        setStageVisible(true);
      }, FADE_MS);
    }, STAGE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeout);
    };
  }, [view]);

  function handleToggleVibe(vibeId: string) {
    setVibes((prev) => {
      if (prev.includes(vibeId)) {
        // keep at least one vibe selected
        return prev.length === 1 ? prev : prev.filter((v) => v !== vibeId);
      }
      return [...prev, vibeId];
    });
  }

  function handleToggleAllergyPreset(id: string) {
    setAllergyPresets((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function handleAddCustomAllergy(value: string) {
    setCustomAllergies((prev) => (prev.includes(value) ? prev : [...prev, value]));
  }

  function handleRemoveCustomAllergy(value: string) {
    setCustomAllergies((prev) => prev.filter((v) => v !== value));
  }

  const avoid = [
    ...allergyPresets.map((id) => ALLERGY_PRESETS.find((p) => p.id === id)?.label ?? id),
    ...customAllergies,
  ];

  async function handleGenerate() {
    if (includedNames.length === 0) {
      setError("Add (and tick) at least one ingredient first.");
      return;
    }
    setError(null);
    setView("loading");
    const vibe = vibes.join(", ");
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: includedNames,
          dishType,
          vibe,
          servings,
          spiceLevel,
          saltLevel,
          sweetLevel,
          avoid,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong generating your recipe.");
      }
      const generated = data as GeneratedRecipe;
      setRecipe(generated);
      addRecipe(generated, {
        ingredients: includedNames,
        dishType,
        vibe,
        servings,
        spiceLevel,
        saltLevel,
        sweetLevel,
        avoid,
      });
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
    <div className="relative flex-1 flex items-center justify-center px-4 py-10 sm:py-16 overflow-hidden">
      <div className="w-full max-w-xl">
        {view === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <p
              className={`font-retro text-3xl text-rust transition-opacity duration-300 ease-in-out ${
                stageVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {LOADING_MESSAGES[stageIndex]}
            </p>
            <div className="flex flex-col items-center">
              <FryingPan className="w-16 h-10" />
              <PanSmoke mode="always" className="w-16 h-10 -mt-10" />
            </div>
            <p className="text-xs text-ink-soft/70 font-body">still cooking — hang tight</p>
          </div>
        )}

        {view === "form" && (
          <div className="animate-[fadein-slow_.4s_ease] space-y-6">
            <RetroIngredientInput ingredients={ingredients} onChange={setIngredients} />

            <RetroControls
              dishType={dishType}
              onDishTypeChange={setDishType}
              vibes={vibes}
              onToggleVibe={handleToggleVibe}
              spiceLevel={spiceLevel}
              onSpiceLevelChange={setSpiceLevel}
              saltLevel={saltLevel}
              onSaltLevelChange={setSaltLevel}
              sweetLevel={sweetLevel}
              onSweetLevelChange={setSweetLevel}
              servings={servings}
              onServingsChange={setServings}
            />

            <RetroAllergies
              selectedPresets={allergyPresets}
              onTogglePreset={handleToggleAllergyPreset}
              customEntries={customAllergies}
              onAddCustom={handleAddCustomAllergy}
              onRemoveCustom={handleRemoveCustomAllergy}
            />

            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleGenerate}
                className="peer rounded-lg bg-rust px-6 py-2.5 font-retro text-2xl text-paper shadow-sm hover:bg-terracotta-dark hover:-rotate-1 transition-all cursor-pointer"
              >
                Start cooking
              </button>

              <FryingPan className="w-16 h-10 mt-4" />
              <PanSmoke mode="peer-hover" className="w-16 h-10 -mt-10" />

              {error && <p className="mt-2 text-sm text-terracotta-dark font-body">{error}</p>}
            </div>

            <RetroHistory history={history} onSelect={handleSelectHistory} onRemove={removeRecipe} />
          </div>
        )}

        {view === "result" && recipe && (
          <div className="animate-[fadein-slow_.4s_ease] space-y-4">
            <button
              type="button"
              onClick={handleNewRecipe}
              className="font-retro text-xl text-ink-soft hover:text-rust transition-colors cursor-pointer"
            >
              ‹ New recipe
            </button>
            <div className="mt-12">
              <RetroRecipeDisplay recipe={recipe} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
