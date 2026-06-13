"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UnexpectedErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const UnexpectedError = ({ error, reset }: UnexpectedErrorProps) => {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      reset();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12 md:min-h-[calc(100vh-64px)]">
      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Typography variant="h3" weight="semibold" color="primary">
            Something went wrong
          </Typography>
          <Typography variant="body" color="muted" className="max-w-md">
            {error.message ||
              "An unexpected error occurred. Please try again or return home."}
          </Typography>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {retryCount < 3 && (
            <Button onClick={handleRetry} className="min-w-[120px]">
              Try Again {retryCount > 0 && `(${3 - retryCount})`}
            </Button>
          )}
          <Button
            variant={retryCount < 3 ? "outline" : "default"}
            onClick={() => router.push("/")}
            className="min-w-[120px] border-primary text-primary hover:bg-primary/5"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};
