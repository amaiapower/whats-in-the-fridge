import { DISH_TYPES, type SavedRecipe } from "@/lib/types";

type Props = {
  history: SavedRecipe[];
  onSelect: (recipe: SavedRecipe) => void;
  onRemove: (id: string) => void;
};

const BOOKMARK_COLORS = ["bg-sage", "bg-mustard", "bg-terracotta", "bg-rust"];
const BOOKMARK_CLIP = "polygon(0% 0%, 100% 0%, 100% 100%, 50% 74%, 0% 100%)";

export default function RetroHistory({ history, onSelect, onRemove }: Props) {
  if (history.length === 0) return null;

  const normalizeDishType = (id: string | undefined) => {
    if (id === "dressing") return "sauce";
    if (!id || id === "meal") return "dinner";
    return id;
  };

  const groups = DISH_TYPES.map((dishType) => ({
    dishType,
    recipes: history.filter((r) => normalizeDishType(r.request.dishType) === dishType.id),
  })).filter((group) => group.recipes.length > 0);

  return (
    <details className="mt-2 text-center">
      <summary className="inline-flex items-center gap-2 list-none [&::-webkit-details-marker]:hidden cursor-pointer rounded-xl bg-rust px-5 py-2 font-retro text-xl text-paper shadow-sm hover:bg-terracotta-dark transition-colors">
        <span aria-hidden>📖</span>
        Your Recipe Book
        <span className="rounded-full bg-paper/25 px-2 text-sm">{history.length}</span>
      </summary>
      <div className="mt-4 max-w-sm mx-auto text-left space-y-5">
        {groups.map((group) => (
          <div key={group.dishType.id}>
            <h4 className="flex items-center gap-1.5 font-retro text-lg text-ink-soft/80 mb-2 px-1">
              <span aria-hidden>{group.dishType.emoji}</span>
              {group.dishType.label}
            </h4>
            <ul className="space-y-2.5">
              {group.recipes.map((recipe, i) => (
                <li
                  key={recipe.id}
                  className="group relative flex items-center gap-2.5 rounded-lg bg-paper pl-1.5 pr-2 py-1.5 shadow-sm hover:shadow-md hover:-translate-x-0.5 transition-all"
                >
                  <span
                    className={`flex-none w-4 h-7 shadow-sm ${BOOKMARK_COLORS[i % BOOKMARK_COLORS.length]}`}
                    style={{ clipPath: BOOKMARK_CLIP }}
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={() => onSelect(recipe)}
                    className="flex-1 min-w-0 text-left font-retro text-lg text-ink hover:text-rust transition-colors cursor-pointer truncate"
                  >
                    {recipe.title}
                  </button>
                  <button
                    type="button"
                    aria-label="Remove from history"
                    onClick={() => onRemove(recipe.id)}
                    className="flex-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-ink-soft/60 hover:text-rust transition-opacity cursor-pointer px-1 text-xs font-body"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
