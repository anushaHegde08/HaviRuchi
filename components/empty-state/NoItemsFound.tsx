import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface NoItemsFoundProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export const NoItemsFound = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: NoItemsFoundProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 gap-4 text-center">
      <div className="bg-primary/10 rounded-full p-6">{icon}</div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-secondary max-w-xs">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Button onClick={() => router.push(actionHref)} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
