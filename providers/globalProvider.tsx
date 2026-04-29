"use client";
import { useState, ReactNode, useEffect } from "react";
import { GlobalContext } from "@/context/globalContext";
import { discoverMockData } from "@/mockData/data";
import { RecipeItem } from "@/types";

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [allRecipes, setAllRecipes] = useState<RecipeItem[]>([]);

  const toggleFavorite = (id: string) => {
    setAllRecipes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  useEffect(() => {
    console.log("allRecipes in context:", allRecipes);
  }, [allRecipes]);

  return (
    <GlobalContext.Provider
      value={{
        searchOpen,
        setSearchOpen,
        filterOpen,
        setFilterOpen,
        allRecipes,
        setAllRecipes,
        toggleFavorite,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
