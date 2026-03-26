"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, Home, Menu, PlusCircle, UserCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    icon: <Home className="h-5 w-5" />,
    href: "/screens/discover",
  },
  {
    name: "Add",
    icon: <PlusCircle className="h-5 w-5" />,
    href: "/screens/add-recipe",
  },
  {
    name: "Favorites",
    icon: <Heart className="h-5 w-5" />,
    href: "/screens/favorites",
  },
  {
    name: "Profile",
    icon: <UserCircle className="h-5 w-5" />,
    href: "/screens/profile",
  },
];

const NavLinks = ({
  className,
  onLinkClick,
}: {
  className?: string;
  onLinkClick?: () => void;
}) => {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={onLinkClick}
          className={cn(
            "transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-secondary",
            className,
          )}
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b bg-background sticky top-0 px-6 z-50">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Haviruchi
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <NavLinks className="flex items-center gap-1 text-sm font-medium" />
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <div className="hidden md:flex lg:hidden flex-col border-b shadow-md bg-background absolute left-0 right-0 px-6 py-4 gap-4">
            <NavLinks
              className="flex items-center gap-2 text-sm font-medium"
              onLinkClick={() => setMenuOpen(false)}
            />
          </div>
        )}
      </header>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex items-center justify-around h-16">
          <NavLinks className="flex flex-col items-center gap-1 text-xs font-medium" />
        </div>
      </nav>
    </>
  );
}
