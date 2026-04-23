"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RecipeImageProps {
  image: string;
  title: string;
  favorite: boolean;
  onFavoriteToggle: () => void;
}

export const RecipeImage = ({
  image,
  title,
  favorite,
  onFavoriteToggle,
}: RecipeImageProps) => {
  const router = useRouter();
  return (
    <div className="relative w-full">
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <Button
          size="icon"
          variant="ghost"
          className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            const updatedFavorite = !favorite;
            onFavoriteToggle();
            if (updatedFavorite) {
              toast.success("Recipe successfully added to your Favorites", {
                position: "top-right",
              });
            } else {
              toast.error("Recipe successfully removed from your Favorites", {
                position: "top-right",
              });
            }
          }}
          className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              favorite ? "fill-primary text-primary" : "",
            )}
          />
        </Button>
      </div>
      <div className="relative w-full h-64 md:h-96 md:rounded-2xl overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
    </div>
  );
};
