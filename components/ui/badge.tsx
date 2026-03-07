import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        soft: "",
      },
      tone: {
        easy: "bg-badge-easy/5 text-badge-easy border-badge-easy/25 hover:bg-badge-easy/20",
        medium:
          "bg-badge-medium/5 text-badge-medium border-badge-medium/25 hover:bg-badge-medium/20",
        hard: "bg-badge-hard/5 text-badge-hard border-badge-hard/25 hover:bg-badge-hard/20",
        time: "bg-badge-time/5 text-badge-time border-badge-time/25 hover:bg-badge-time/20",
        category:
          "bg-badge-category/5 text-badge-category border-badge-category/25 hover:bg-badge-category/20",
        servings:
          "bg-badge-servings/5 text-badge-servings border-badge-servings/25 hover:bg-badge-servings/20",
        unselected:
          "bg-badge-unselected/5 text-badge-unselected/90 border-badge-unselected/25 hover:bg-badge-unselected/20",
        selected:
          "bg-badge-selected/25 text-badge-selected border-badge-selected/25 hover:bg-badge-selected/40",
      },
    },
    defaultVariants: {
      variant: "soft",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, tone, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, tone }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
