"use client";
import React from "react";

interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return <>{children}</>;
};

export default RootProvider;
