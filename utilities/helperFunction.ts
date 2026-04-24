import { RecipeItem } from "@/types";

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
