import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-[text-secondary-foreground]", {
  variants: {
    variant: {
      h1: "text-5xl font-semibold",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      body: "text-sm",
      caption: "text-xs text-[text-secondary-foreground]/70",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      primary: "text-[#FF6464]",
      text: "text-[text-secondary-foreground]",
      muted: "text-[text-secondary-foreground]/70",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
    color: "text",
  },
});

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof typographyVariants>;

const Typography = ({
  children,
  className,
  variant,
  weight,
  color,
}: TypographyProps) => {
  return (
    <p
      className={cn(typographyVariants({ variant, weight, color }), className)}
    >
      {children}
    </p>
  );
};

export { Typography, typographyVariants };
