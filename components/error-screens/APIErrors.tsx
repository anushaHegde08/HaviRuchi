"use client";

import ButtonLoadingSpinner from "@/components/loading/ButtonLoadingSpinner";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ServerCrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface APIErrorsProps {
  onRetry: () => void | Promise<void>;
  className?: string;
}

export const APIErrors = ({ onRetry, className }: APIErrorsProps) => {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (retryCount < 3) {
      setIsRetrying(true);
      setRetryCount((prev) => prev + 1);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const goHomePath = "/";

  return (
    <div className={cn("flex w-full min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12 md:min-h-[calc(100vh-64px)]", className)}>
      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <ServerCrash className="h-8 w-8 text-destructive" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Typography variant="body" weight="semibold" color="primary">
            {retryCount < 3
              ? "Failed to load data. Please try again."
              : "Failed to load data after multiple attempts."}
          </Typography>
        </div>

        <div className="mt-2 flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {retryCount < 3 && (
              <Button
                onClick={handleRetry}
                className="min-w-[120px]"
                size="default"
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <ButtonLoadingSpinner loadingText="Retrying..." />
                ) : (
                  "Try Again"
                )}
              </Button>
            )}
            <Button
              variant={retryCount < 3 ? "outline" : "default"}
              onClick={() => router.push(goHomePath)}
              className={
                retryCount < 3
                  ? "min-w-[120px] border-primary text-primary hover:bg-primary/5"
                  : "min-w-[120px]"
              }
              size="default"
            >
              Go Home
            </Button>
          </div>
          {retryCount < 3 && (
            <span className="text-xs text-muted-foreground">
              {3 - retryCount} attempts remaining
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
