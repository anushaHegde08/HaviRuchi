"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChefHat,
  ChevronDown,
  Facebook,
  Heart,
  Instagram,
  PlusCircle,
  Search,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style
        dangerouslySetInnerHTML={{
          __html: "html { scroll-behavior: smooth; }",
        }}
      />

      {/* Custom Navbar for Home */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur shadow-sm py-4" : "bg-transparent py-6"}`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <Image
              src="/images/HaviRuchi_logo.png"
              alt="HaviRuchi Logo"
              width={90}
              height={40}
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/screens/sign-in">
              <Button
                variant={scrolled ? "ghost" : "secondary"}
                className={
                  !scrolled
                    ? "bg-primary/10 hover:bg-primary/20 text-primary border-0 backdrop-blur-sm"
                    : "text-foreground"
                }
              >
                Sign In
              </Button>
            </Link>
            <Link href="/screens/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-primary/20 to-background">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-6 tracking-tight">
            HaviRuchi
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-6 max-w-[800px] text-foreground">
            Discover & Preserve Authentic Havyaka Cuisine
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-[600px]">
            Explore traditional recipes passed down through generations. Cook,
            share and celebrate the rich culinary heritage of Havyaka Brahmins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/screens/sign-up" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/screens/sign-in" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg h-14 px-8 rounded-full border-primary text-primary hover:bg-primary/10 shadow-sm hover:shadow-md transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce text-muted-foreground">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 flex flex-col items-center text-center border-none shadow-lg bg-card/50 hover:bg-card hover:-translate-y-2 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Discover Recipes</h3>
              <p className="text-muted-foreground">
                Browse hundreds of authentic Havyaka recipes filtered by
                category, difficulty and cook time.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 flex flex-col items-center text-center border-none shadow-lg bg-card/50 hover:bg-card hover:-translate-y-2 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Save Favourites</h3>
              <p className="text-muted-foreground">
                Save your favourite recipes and access them anytime from any
                device.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 flex flex-col items-center text-center border-none shadow-lg bg-card/50 hover:bg-card hover:-translate-y-2 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <PlusCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Share Your Recipes</h3>
              <p className="text-muted-foreground">
                Contribute to the community by sharing your own traditional
                family recipes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary">
            Start Cooking in 3 Simple Steps
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative max-w-5xl mx-auto">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-primary/20 -z-10" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center flex-1 z-10 relative group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 shadow-sm group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                <UserCircle className="w-10 h-10 text-primary group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold absolute top-0 -right-2 md:right-[20%] shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Create Account</h3>
              <p className="text-muted-foreground">
                Join our community to start your culinary journey.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center flex-1 z-10 relative group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 shadow-sm group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                <Search className="w-10 h-10 text-primary group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold absolute top-0 -right-2 md:right-[20%] shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Discover Recipes</h3>
              <p className="text-muted-foreground">
                Find the perfect dish for any occasion effortlessly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center flex-1 z-10 relative group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 shadow-sm group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                <ChefHat className="w-10 h-10 text-primary group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold absolute top-0 -right-2 md:right-[20%] shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Cook & Share</h3>
              <p className="text-muted-foreground">
                Prepare delicious meals and share your creations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-primary-foreground/20">
            <div className="py-4 sm:py-0">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                100+
              </div>
              <div className="text-primary-foreground/90 font-medium">
                Recipes
              </div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                50+
              </div>
              <div className="text-primary-foreground/90 font-medium">
                Users
              </div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                10+
              </div>
              <div className="text-primary-foreground/90 font-medium">
                Categories
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-primary mb-4">
                HaviRuchi
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Discover & Preserve Authentic Havyaka Cuisine. A
                community-driven recipe platform.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/screens/sign-up"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Discover Recipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/screens/sign-in"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/screens/sign-up"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:contact@haviruchi.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    contact@haviruchi.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 HaviRuchi. Celebrating Havyaka Heritage.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
