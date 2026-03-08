"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Heading,
  Heart,
  Home,
  PlusCircle,
  Search,
  UserCircle,
} from "lucide-react";
import { useGlobalContext } from "@/context";
import { Button } from "../ui/button";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href?: string;
  handleClick?: () => void;
}

export function Navbar() {
  const pathname = usePathname();
  const { searchOpen, setSearchOpen } = useGlobalContext();

  const navItems: NavItem[] = [
    // {
    //   name: "Search",
    //   icon: <Search className="h-5 w-5" />,
    //   handleClick: () => setSearchOpen(!searchOpen),
    // },
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
  ];

  return (
    <header className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Haviruchi
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 md:gap-8">
          {navItems.map(
            (item) =>
              item.href ? (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={item.handleClick}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href && !searchOpen
                      ? "text-primary"
                      : "text-secondary",
                  )}
                >
                  <div className="flex items-center gap-1">
                    {item.icon} {item.name}
                  </div>
                </Link>
              ) : null,
            // <Button
            //   key={item.name}
            //   variant="ghost"
            //   onClick={item.handleClick}
            //   className={cn(
            //     "text-sm font-medium transition-colors hover:bg-transparent hover:text-primary",
            //     searchOpen ? "text-primary" : "text-secondary",
            //   )}
            // >
            //   <div className="flex items-center gap-1">
            //     {item.icon} {item.name}
            //   </div>
            // </Button>
          )}

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-secondary hover:text-primary">
              <div className="flex items-center gap-1">
                <Filter className="h-5 w-5" /> Filter
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Breakfast</DropdownMenuItem>
              <DropdownMenuItem>Lunch</DropdownMenuItem>
              <DropdownMenuItem>Dinner</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <Link
            href="screens/profile"
            className={cn(
              "text-sm font-medium hover:text-primary",
              pathname === "screens/profile"
                ? "text-primary"
                : "text-secondary",
            )}
          >
            <div className="flex items-center gap-1">
              <UserCircle className="h-5 w-5" /> Profile
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
