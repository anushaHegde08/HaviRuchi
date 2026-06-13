"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ServerCrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface APIErrorsProps {
  message: string;
  onRetry: () => void;
}

export const APIErrors = ({ message, onRetry }: APIErrorsProps) => {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      onRetry();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12 md:min-h-[calc(100vh-64px)]">
      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <ServerCrash className="h-8 w-8 text-destructive" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Typography variant="body" weight="semibold" color="primary">
            {message}
          </Typography>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {retryCount < 3 && (
            <Button
              onClick={handleRetry}
              className="min-w-[120px]"
              size="default"
            >
              Try Again {retryCount > 0 && `(${3 - retryCount})`}
            </Button>
          )}
          <Button
            variant={retryCount < 3 ? "outline" : "default"}
            onClick={() => router.push("/")}
            className="min-w-[120px] border-primary text-primary hover:bg-primary/5"
            size="default"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};
