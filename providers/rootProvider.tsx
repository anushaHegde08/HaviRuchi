"use client";
import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "./globalProvider";
import { ErrorProvider } from "./errorProvider";
import React from "react";

interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <SessionProvider>
      <GlobalProvider>
        <ErrorProvider>{children}</ErrorProvider>
      </GlobalProvider>
    </SessionProvider>
  );
};

export default RootProvider;
