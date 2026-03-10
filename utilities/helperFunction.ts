const favoriteRecipesLength = (favoriteRecipes: any) => {
  return favoriteRecipes.filter((item: any) => item.isFavorite).length;
};

const totalPages = (Recipes: any, itemsPerPage: number) => {
  return Math.ceil(Recipes.length / itemsPerPage);
};

export { favoriteRecipesLength, totalPages };
