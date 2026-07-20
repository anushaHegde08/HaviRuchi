"use client";
import { BadgeFilterState, PanelFilterState, FilterMode, RecipeDetail, RecipeItem } from "@/types";
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
  invalidateRecipeDetail: (id: string) => void;
  discoverSearchQuery: string;
  setDiscoverSearchQuery: (value: string) => void;
  activeFilterMode: FilterMode;
  setActiveFilterMode: (value: FilterMode | ((prev: FilterMode) => FilterMode)) => void;
  badgeFilters: BadgeFilterState;
  setBadgeFilters: (value: BadgeFilterState | ((prev: BadgeFilterState) => BadgeFilterState)) => void;
  panelFilters: PanelFilterState;
  setPanelFilters: (value: PanelFilterState | ((prev: PanelFilterState) => PanelFilterState)) => void;

  discoverCurrentPage: number;
  setDiscoverCurrentPage: (value: number | ((prev: number) => number)) => void;
  discoverMobileVisibleCount: number;
  setDiscoverMobileVisibleCount: (value: number | ((prev: number) => number)) => void;
  pendingCount: number;
  setPendingCount: (value: number | ((prev: number) => number)) => void;
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
