"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ErrorProvider } from "./errorProvider";
import { GlobalProvider } from "./globalProvider";

interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <GlobalProvider>
        <ErrorProvider>{children}</ErrorProvider>
      </GlobalProvider>
    </SessionProvider>
  );
};

export default RootProvider;
