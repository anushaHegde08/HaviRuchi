"use client";
import { GlobalContext } from "@/context/globalContext";
import { MOBILE_LOAD_COUNT } from "@/lib/utilities/constatnts";
import { defaultFilters, FilterState, RecipeDetail, RecipeItem } from "@/types";
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

  const invalidateRecipeDetail = (id: string) => {
    setRecipeDetails((prev) => {
      const newDetails = { ...prev };
      delete newDetails[id];
      return newDetails;
    });
  };

  const [discoverSearchQuery, setDiscoverSearchQuery] = useState("");
  const [discoverFilters, setDiscoverFilters] =
    useState<FilterState>(defaultFilters);
  const [discoverSelectedCategory, setDiscoverSelectedCategory] =
    useState("All");
  const [discoverCurrentPage, setDiscoverCurrentPage] = useState(0);
  const [discoverMobileVisibleCount, setDiscoverMobileVisibleCount] =
    useState(MOBILE_LOAD_COUNT);
  const [pendingCount, setPendingCount] = useState(0);

  const toggleFavorite = (id: string) => {
    setAllRecipes((prev) =>
      prev.map((item) =>
        item._id.toString() === id.toString() ||
        item.id?.toString() === id.toString()
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
        invalidateRecipeDetail,
        discoverSearchQuery,
        setDiscoverSearchQuery,
        discoverFilters,
        setDiscoverFilters,
        discoverSelectedCategory,
        setDiscoverSelectedCategory,
        discoverCurrentPage,
        setDiscoverCurrentPage,
        discoverMobileVisibleCount,
        setDiscoverMobileVisibleCount,
        pendingCount,
        setPendingCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
