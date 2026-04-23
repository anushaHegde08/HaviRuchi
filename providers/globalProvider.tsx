"use client";
import { useState, ReactNode } from "react";
import { GlobalContext } from "@/context/globalContext";
import { discoverMockData } from "@/mockData/data";
import { RecipeItem } from "@/types";

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [allRecipes, setAllRecipes] = useState<RecipeItem[]>(discoverMockData);

  const toggleFavorite = (id: number) => {
    setAllRecipes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
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
        toggleFavorite,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
