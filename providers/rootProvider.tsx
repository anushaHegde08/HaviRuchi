"use client";
import React from "react";
import { GlobalProvider } from "./globalProvider";

interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return <GlobalProvider>{children}</GlobalProvider>;
};

export default RootProvider;
