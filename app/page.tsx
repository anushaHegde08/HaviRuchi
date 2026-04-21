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
      <Card className="rounded-full aspect-square w-80 sm:w-96 lg:w-[28rem] bg-[#D9D9D9]/60 border-none flex flex-col items-center justify-center gap-6 sm:gap-8 text-center">
        <Typography variant="h2" weight="bold" color="primary">
          Welcome to <br /> Havi Ruchi
        </Typography>
        <Typography variant="h3" weight="semibold">
          Timeless Flavors from the <br /> Heart of Havyaka Homes
        </Typography>
        <Link href="/screens/sign-up">
          <Button size="lg">Get Started</Button>
        </Link>
      </Card>
    </main>
  );
}
