"use client";
import { createContext, useContext } from "react";

export interface GlobalContextType {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
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
