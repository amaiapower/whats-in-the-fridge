import type { SavedRecipe } from "@/lib/types";

type Props = {
  history: SavedRecipe[];
  activeId?: string;
  onSelect: (recipe: SavedRecipe) => void;
  onRemove: (id: string) => void;
};

export default function RecipeHistory({ history, activeId, onSelect, onRemove }: Props) {
  if (history.length === 0) {
    return (
      <div className="rounded-3xl bg-paper border border-line shadow-sm p-6">
        <h2 className="font-hand text-2xl text-terracotta-dark mb-1">Recipe box</h2>
        <p className="text-sm text-ink-soft">
          Recipes you generate will be tucked away here so you can find them again.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-paper border border-line shadow-sm p-6">
      <h2 className="font-hand text-2xl text-terracotta-dark mb-3">Recipe box</h2>
      <ul className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
        {history.map((recipe) => (
          <li key={recipe.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(recipe)}
              className={`w-full text-left rounded-xl px-3 py-2.5 pr-8 transition-colors cursor-pointer ${
                recipe.id === activeId
                  ? "bg-sage/20 border border-sage"
                  : "hover:bg-cream border border-transparent"
              }`}
            >
              <p className="text-sm font-semibold text-ink truncate">{recipe.title}</p>
              <p className="text-xs text-ink-soft truncate">
                {recipe.request.vibe} · serves {recipe.request.servings}
              </p>
            </button>
            <button
              type="button"
              aria-label="Remove from history"
              onClick={() => onRemove(recipe.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 text-ink-soft hover:text-terracotta-dark transition-opacity cursor-pointer px-1"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
