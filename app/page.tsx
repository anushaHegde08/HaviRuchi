"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const pathname = usePathname();
  return (
    <main
      className="flex min-h-screen bg-cover bg-center bg-no-repeat flex-col items-center justify-center gap-6 p-4 sm:p-8 md:p-12 lg:p-24"
      style={{
        backgroundImage: "url('/images/Havyaka-Uta.png')",
      }}
    >
      <Card className="rounded-full aspect-square w-80 sm:w-96 lg:w-[28rem] bg-[#D9D9D9]/50 border-none flex flex-col items-center justify-center gap-4 text-center">
        <Typography variant="h2" color="primary">
          Welcome to Havi Ruchi
        </Typography>
        <Typography variant="h3" className="px-4 sm:px-6 md:px-8">
          Timeless Flavors from the Heart of Havyaka Homes
        </Typography>
        <Link href="/auth/sign-up">
          <Button className="mt-4 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
            Get Started
          </Button>
        </Link>
      </Card>
    </main>
  );
}
