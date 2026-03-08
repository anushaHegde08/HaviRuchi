import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-[text-secondary-foreground]", {
  variants: {
    variant: {
      h1: "text-4xl md:text-5xl lg:text-6xl font-bold",
      h2: "text-3xl sm:text-4xl lg:text-5xl font-semibold",
      h3: "text-base sm:text-lg lg:text-2xl font-semibold",
      body: "text-sm md:text-base lg:text-lg",
      caption: "text-xs md:text-sm text-[text-secondary-foreground]/70",
      small: "text-xs",
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
