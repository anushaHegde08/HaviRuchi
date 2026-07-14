import { RecipeItem, Ingredient } from "@/types";
export const totalPages = (recipes: RecipeItem[], itemsPerPage: number) => {
  return Math.ceil(recipes.length / itemsPerPage);
};

export const formatTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const hourLabel = hours === 1 ? "Hour" : "Hours";
  const minLabel = mins === 1 ? "Min" : "Mins";
  if (hours === 0) return `${mins} ${minLabel}`;
  if (mins === 0) return `${hours} ${hourLabel}`;
  return `${hours}H ${mins}M`;
};

export const generateTimeOptions = () => {
  const options = [];
  for (let i = 10; i <= 240; i += 10) {
    if (i < 60) {
      options.push({ label: `${i} mins`, value: i });
    } else {
      const hrs = Math.floor(i / 60);
      const mins = i % 60;
      if (mins === 0) {
        options.push({ label: `${hrs} hr${hrs > 1 ? "s" : ""}`, value: i });
      } else {
        options.push({
          label: `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} mins`,
          value: i,
        });
      }
    }
  }
  return options;
};

export const capitalizeFirst = (value: string) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const scaleIngredients = (
  ingredients: Ingredient[],
  originalServings: number,
  targetServings: number
): Ingredient[] => {
  if (originalServings === targetServings || originalServings <= 0) {
    return ingredients;
  }
  
  const ratio = targetServings / originalServings;
  
  return ingredients.map(ingredient => {
    if (ingredient.quantity !== null) {
      return {
        ...ingredient,
        quantity: parseFloat((ingredient.quantity * ratio).toFixed(2))
      };
    }
    return ingredient;
  });
};
