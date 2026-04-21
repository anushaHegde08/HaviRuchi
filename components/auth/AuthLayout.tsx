import Link from "next/link";
import { Utensils } from "lucide-react";
import { Typography } from "../ui/typography";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  buttonLoading?: boolean;
  showLogo?: boolean;
  children: React.ReactNode;
}

export const AuthLayout = ({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  buttonLoading = false,
  showLogo = false,
  children,
}: AuthLayoutProps) => (
  <div className="min-h-screen flex bg-background px-6">
    {/* Left panel — desktop only */}
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-primary/80 to-primary/30 flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <Typography weight="bold" color="foreground" variant="h2">
          HaviRuchi
        </Typography>
        <Typography weight="bold" color="foreground" variant="h2">
          Discover & Save
          <br />
          Authentic Recipes
        </Typography>
      </div>
      <Typography
        variant="caption"
        color="foreground"
        className="fixed bottom-10"
      >
        © 2026 HaviRuchi. Celebrating Havyaka Heritage.
      </Typography>
    </div>

    {/* Right panel — form */}
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Logo — mobile only, sign-in only */}
        {showLogo && (
          <div className="flex justify-center md:hidden">
            <Utensils className="h-12 w-12 text-primary" />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <Typography variant="large" weight="bold" color="primary">
            {title}
          </Typography>
          <Typography variant="small" color="muted" position="start">
            {subtitle}
          </Typography>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">{children}</div>

        {/* Footer */}
        <Typography variant="small" color="muted">
          {footerText}{" "}
          <Link
            href={buttonLoading ? "#" : footerLinkHref}
            onClick={(e) => {
              if (buttonLoading) e.preventDefault();
            }}
            className={`text-primary font-medium hover:underline ${buttonLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          >
            {footerLinkText}
          </Link>
        </Typography>
      </div>
    </div>
  </div>
);
