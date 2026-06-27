"use client";

import ButtonLoadingSpinner from "@/components/loading/ButtonLoadingSpinner";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface UnexpectedErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  className?: string;
}

export const UnexpectedError = ({ error, reset, className }: UnexpectedErrorProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    startTransition(() => {
      reset();
    });
  };

  const goHomePath = "/";

  return (
    <div className={cn("flex w-full min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12 md:min-h-[calc(100vh-64px)]", className)}>
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

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => router.push(goHomePath)}
              variant="default"
              className="min-w-[120px]"
            >
              Go Home
            </Button>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="min-w-[120px] border-primary text-primary hover:bg-primary/5"
              disabled={isPending}
            >
              {isPending ? (
                <ButtonLoadingSpinner loadingText="Retrying..." />
              ) : (
                "Try Again"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

