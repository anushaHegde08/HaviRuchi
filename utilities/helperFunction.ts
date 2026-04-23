import { RecipeItem } from "@/types";

const calculateTotalPages = (recipes: RecipeItem[], itemsPerPage: number) => {
  return Math.ceil(recipes.length / itemsPerPage);
};

export { calculateTotalPages as totalPages };
