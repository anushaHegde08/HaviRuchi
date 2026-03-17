import { RecipeItem } from "@/types";

const favoriteRecipesLength = (favoriteRecipes: RecipeItem[]) => {
  return favoriteRecipes.filter((item: any) => item.isFavorite).length;
};

const calculateTotalPages = (recipes: RecipeItem[], itemsPerPage: number) => {
  return Math.ceil(recipes.length / itemsPerPage);
};

export { favoriteRecipesLength, calculateTotalPages as totalPages };
