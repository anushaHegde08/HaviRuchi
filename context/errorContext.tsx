"use client";
import { createContext, useContext } from "react";

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(
  undefined,
);

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context)
    throw new Error("useErrorContext must be used inside ErrorProvider");
  return context;
}
