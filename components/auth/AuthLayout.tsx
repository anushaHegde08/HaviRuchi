import Link from "next/link";
import { Utensils } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  showLogo?: boolean;
  children: React.ReactNode;
}

export const AuthLayout = ({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  showLogo = false,
  children,
}: AuthLayoutProps) => (
  <div className="min-h-screen flex bg-background px-6">
    {/* Left panel — desktop only */}
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-primary/80 to-primary/30 flex-col items-center justify-center gap-8 p-10">
      <span className="text-white font-bold text-xl">HaviRuchi</span>
      <div className="flex flex-col">
        <h2 className="text-white text-4xl text-center font-bold leading-tight">
          Discover & Save
          <br />
          Authentic Recipes
        </h2>
      </div>
      {/* <p className="text-white/60 text-sm">
        © 2023 HaviRuchi. Celebrating Havyaka Heritage.
      </p> */}
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
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">{children}</div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="text-primary font-medium hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  </div>
);
