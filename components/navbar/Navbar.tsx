"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Heart,
  LogIn,
  Menu,
  PlusCircle,
  UserCircle,
  ClipboardCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useGlobalContext } from "@/context";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const NavLinks = ({
  className,
  onLinkClick,
}: {
  className?: string;
  onLinkClick?: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { pendingCount, setPendingCount } = useGlobalContext();

  useEffect(() => {
    if (session?.user?.role === "admin") {
      const fetchPendingCount = async () => {
        try {
          const res = await fetch("/api/admin/recipes?status=pending");
          if (res.ok) {
            const data = await res.json();
            setPendingCount(data.length);
          }
        } catch (error) {
          console.error("Failed to fetch pending count", error);
        }
      };
      
      void fetchPendingCount();
    }
  }, [session?.user?.role, setPendingCount]);

  const dynamicNavItems: NavItem[] = [
    {
      name: "Recipes",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/screens/discover",
    },
    ...(session?.user?.role === "admin"
      ? [
          {
            name: "Approvals",
            icon: <ClipboardCheck className="h-5 w-5" />,
            href: "/admin/recipes",
            badge: pendingCount,
          },
        ]
      : []),
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
    status === "unauthenticated"
      ? {
          name: "Sign In",
          icon: <LogIn className="h-5 w-5" />,
          href: "/screens/sign-in",
        }
      : {
          name: "Profile",
          icon: <UserCircle className="h-5 w-5" />,
          href: "/screens/profile",
        },
  ];

  const handleLinkClick = (e: React.MouseEvent, item: NavItem) => {
    if (
      status === "unauthenticated" &&
      (item.href === "/screens/favorites" ||
        item.href === "/screens/add-recipe")
    ) {
      e.preventDefault();
      toast.error(`Please sign in to access ${item.name}`);
      router.push("/screens/sign-in");
      return;
    }
    if (onLinkClick) onLinkClick();
  };

  return (
    <>
      {dynamicNavItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={(e) => handleLinkClick(e, item)}
          className={cn(
            "transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-secondary",
            className,
          )}
        >
          <div className="relative flex items-center justify-center">
            {item.icon}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </div>
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const hideNavItemsPaths = [
    "/screens/sign-in",
    "/screens/sign-up",
    "/screens/forgot-password",
    "/screens/reset-password",
  ];
  const hideNavItems = hideNavItemsPaths.includes(pathname);

  return (
    <>
      <header className="border-b bg-background sticky top-0 px-6 z-50">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <Image
              src="/images/HaviRuchi_logo.png"
              alt="HaviRuchi Logo"
              width={90}
              height={36}
              priority
              className="py-2"
            />
          </Link>
          {!hideNavItems && (
            <>
              <nav className="hidden lg:flex items-center gap-8">
                <NavLinks className="flex items-center gap-1 text-sm font-medium" />
              </nav>

              {/* Hamburger — tablet only (md to lg) */}
              <div className="hidden md:block lg:hidden">
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64 pt-12">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Access main navigation links
                    </SheetDescription>
                    <nav className="flex flex-col gap-6 px-4">
                      <NavLinks
                        className="flex items-center gap-3 text-base font-medium"
                        onLinkClick={() => setMenuOpen(false)}
                      />
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </header>
      {!hideNavItems && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
          <div className="flex items-center justify-around py-2">
            <NavLinks className="flex flex-col items-center gap-1 text-xs font-medium" />
          </div>
        </nav>
      )}
    </>
  );
}
