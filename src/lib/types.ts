export type Ingredient = {
  id: string;
  name: string;
  included: boolean;
};

export type Vibe = {
  id: string;
  label: string;
  emoji: string;
};

export const VIBES: Vibe[] = [
  { id: "simple", label: "Simple", emoji: "🥄" },
  { id: "fancy", label: "Fancy", emoji: "🕯️" },
  { id: "cozy", label: "Cozy", emoji: "🧣" },
  { id: "snack", label: "Snack", emoji: "🥨" },
  { id: "healthy", label: "Healthy", emoji: "🌿" },
  { id: "spicy", label: "Spicy", emoji: "🌶️" },
  { id: "quick", label: "Quick", emoji: "⏱️" },
];

export type DishType = {
  id: string;
  label: string;
  emoji: string;
};

export const DISH_TYPES: DishType[] = [
  { id: "breakfast", label: "Breakfast", emoji: "🥞" },
  { id: "lunch", label: "Lunch", emoji: "🥪" },
  { id: "dinner", label: "Dinner", emoji: "🍽️" },
  { id: "side", label: "Side", emoji: "🥗" },
  { id: "sauce", label: "Sauce & Dressing", emoji: "🥣" },
  { id: "snack", label: "Snack", emoji: "🥨" },
  { id: "dessert", label: "Dessert", emoji: "🍰" },
];

export type AllergyPreset = {
  id: string;
  label: string;
  emoji: string;
};

export const ALLERGY_PRESETS: AllergyPreset[] = [
  { id: "nut-free", label: "Nut-free", emoji: "🥜" },
  { id: "dairy-free", label: "Dairy-free", emoji: "🥛" },
  { id: "gluten-free", label: "Gluten-free", emoji: "🌾" },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥕" },
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "shellfish-free", label: "Shellfish-free", emoji: "🦐" },
  { id: "egg-free", label: "Egg-free", emoji: "🥚" },
];

export type RecipeRequest = {
  ingredients: string[];
  vibe: string;
  servings: number;
  dishType?: string;
  spiceLevel?: number;
  saltLevel?: number;
  sweetLevel?: number;
  avoid?: string[];
};

export type SourceLink = {
  title: string;
  url: string;
};

export type GeneratedRecipe = {
  title: string;
  description: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
  notes?: string;
  sources: SourceLink[];
};

export type SavedRecipe = GeneratedRecipe & {
  id: string;
  createdAt: string;
  request: RecipeRequest;
};
