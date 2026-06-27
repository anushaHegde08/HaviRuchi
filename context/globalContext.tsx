"use client";
import { FilterState, RecipeDetail, RecipeItem } from "@/types";
import { createContext, useContext } from "react";

export interface GlobalContextType {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  allRecipes: RecipeItem[];
  setAllRecipes: (
    recipes: RecipeItem[] | ((prev: RecipeItem[]) => RecipeItem[]),
  ) => void;
  recipesFetched: boolean;
  setRecipesFetched: (value: boolean) => void;
  favoritesFetched: boolean;
  setFavoritesFetched: (value: boolean) => void;
  toggleFavorite: (id: string) => void;
  recipeDetails: Record<string, RecipeDetail>;
  cacheRecipeDetail: (id: string, recipe: RecipeDetail) => void;
  discoverSearchQuery: string;
  setDiscoverSearchQuery: (value: string) => void;
  discoverFilters: FilterState;
  setDiscoverFilters: (value: FilterState | ((prev: FilterState) => FilterState)) => void;
  discoverSelectedCategory: string;
  setDiscoverSelectedCategory: (value: string) => void;
  discoverCurrentPage: number;
  setDiscoverCurrentPage: (value: number | ((prev: number) => number)) => void;
  discoverMobileVisibleCount: number;
  setDiscoverMobileVisibleCount: (value: number | ((prev: number) => number)) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used inside GlobalProvider");
  return context;
}
