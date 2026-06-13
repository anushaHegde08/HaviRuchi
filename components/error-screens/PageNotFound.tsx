"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";

export const PageNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12 md:min-h-[calc(100vh-64px)]">
      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-6">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Typography variant="h3" weight="semibold" color="primary">
            Page Not Found
          </Typography>
          <Typography variant="body" color="muted" className="max-w-md">
            We couldn&apos;t find the page you&apos;re looking for. It might
            have been moved or doesn&apos;t exist.
          </Typography>
        </div>

        <div className="mt-2">
          <Button
            variant="outline"
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
