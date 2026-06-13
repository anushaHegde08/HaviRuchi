"use client";
import { GlobalContext } from "@/context/globalContext";
import { RecipeDetail, RecipeItem } from "@/types";
import { ReactNode, useState } from "react";

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [allRecipes, setAllRecipes] = useState<RecipeItem[]>([]);
  const [recipesFetched, setRecipesFetched] = useState(false);
  const [favoritesFetched, setFavoritesFetched] = useState(false);

  const [recipeDetails, setRecipeDetails] = useState<
    Record<string, RecipeDetail>
  >({});

  const cacheRecipeDetail = (id: string, recipe: RecipeDetail) => {
    setRecipeDetails((prev) => ({ ...prev, [id]: recipe }));
  };

  const toggleFavorite = (id: string) => {
    setAllRecipes((prev) =>
      prev.map((item) =>
        item._id.toString() === id.toString()
          ? { ...item, isFavorite: !item.isFavorite }
          : item,
      ),
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        searchOpen,
        setSearchOpen,
        filterOpen,
        setFilterOpen,
        allRecipes,
        setAllRecipes,
        recipesFetched,
        setRecipesFetched,
        favoritesFetched,
        setFavoritesFetched,
        toggleFavorite,
        recipeDetails,
        cacheRecipeDetail,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
