import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-[text-secondary-foreground]", {
  variants: {
    variant: {
      h2: "text-3xl sm:text-4xl md:text-4xl lg:text-5xl",
      h3: "text-base sm:text-lg lg:text-2xl",
      body: "text-sm md:text-base lg:text-lg",
      caption: "text-xs md:text-sm text-[text-secondary-foreground]/70",
      large: "text-2xl",
      small: "text-sm",
      xsmall: "text-xs",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      primary: "text-primary",
      foreground: "text-primary-foreground",
      text: "text-[text-secondary-foreground]",
      muted: "text-muted-foreground",
    },
    position: {
      default: "text-center",
      start: "text-start",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
    color: "text",
    position: "default",
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
  position,
}: TypographyProps) => {
  return (
    <p
      className={cn(
        typographyVariants({ variant, weight, color, position }),
        className,
      )}
    >
      {children}
    </p>
  );
};

export { Typography, typographyVariants };
