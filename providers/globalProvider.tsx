"use client";
import { useState, ReactNode } from "react";
import { GlobalContext } from "@/context/globalContext";

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <GlobalContext.Provider value={{ searchOpen, setSearchOpen }}>
      {children}
    </GlobalContext.Provider>
  );
}
