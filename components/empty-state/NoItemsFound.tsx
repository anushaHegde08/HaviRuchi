import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface NoItemsFoundProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export const NoItemsFound = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: NoItemsFoundProps) => {
  const router = useRouter();

  return (
    <div className={cn("flex w-full min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12 md:min-h-[calc(100vh-64px)]", className)}>
      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-6">{icon}</div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-semibold text-primary">{title}</p>
          <p className="max-w-xs text-sm text-secondary">{description}</p>
        </div>
        {actionLabel && actionHref && (
          <Button
            variant="outline"
            onClick={() => router.push(actionHref)}
            className="mt-2 min-w-[140px] border-primary text-primary hover:bg-primary/5"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
