import { Navbar } from "@/components/navbar/Navbar";
import { Toaster } from "sonner";
import React from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <Toaster
        position="top-center"
        duration={3000}
        closeButton={true}
        toastOptions={{
          classNames: {
            icon: "text-primary",
            closeButton: "!left-auto !right-2 !top-1/2 !-translate-y-1/2",
          },
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
    </div>
  );
}
