"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RecipeImageProps {
  image: string;
  title: string;
  favorite: boolean;
  recipeId: string;
  onToggleFavorite: (id: string) => void;
}

export const RecipeImage = ({
  image,
  title,
  favorite,
  recipeId,
  onToggleFavorite,
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
            onToggleFavorite(recipeId);
          }}
          className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              favorite ? "text-red-500 fill-red-500" : "",
            )}
          />
        </Button>
      </div>
      <div className="relative w-full h-64 md:h-96 rounded-md md:rounded-2xl overflow-hidden">
        <Image
          src={image || "/images/placeholder.jpg"}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 100vw"
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
      </div>
    </div>
  );
};
