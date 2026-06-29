"use client";
import { useIsOwner } from "@/hooks/useIsOwner";
import { cn } from "@/lib/utils";
import { RecipeItem } from "@/types";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import RecipeActions from "../recipe/RecipeActions";
import { RecipeBadges } from "../recipe/RecipeBadges";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface RecipeCardProps {
  item: RecipeItem;
  onToggleFavorite: (id: string) => void;
  onClickRecipeCard: (id: string) => void;
  onDelete?: () => void;
  priority?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  item,
  onToggleFavorite,
  onClickRecipeCard,
  onDelete,
  priority = false,
}) => {
  const isOwner = useIsOwner(item);

  const handleFavoriteClick = () => {
    onToggleFavorite(item._id);
  };

  return (
    <Card className="grid grid-cols-6 gap-2">
      <div className="relative col-span-2 h-[100px] overflow-hidden rounded-s-xl md:h-[190px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 33vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/images/placeholder.png";
          }}
        />
      </div>
      <div
        className="col-span-4 min-w-0 py-1 flex flex-col justify-between cursor-pointer"
        onClick={() => onClickRecipeCard(item._id)}
      >
        <div className="grid grid-cols-6">
          <div id="Details" className="col-span-5 min-w-0">
            <CardHeader className="p-0">
              <CardTitle className="text-sm md:text-2xl lg:text-2xl truncate">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-xs md:text-xl lg:text-xl text-secondary/70 line-clamp-2 md:line-clamp-3 break-words whitespace-pre-wrap">
                {item.description}
              </CardDescription>
              {item.createdBy?.name && (
                <p className="text-[10px] md:text-sm text-muted-foreground mt-1">
                  by {item.createdBy.name}
                </p>
              )}
            </CardContent>
          </div>
          <div id="Actions" className="col-span-1">
            <CardAction
              className="flex flex-col items-center gap-1 md:gap-2 border-t-0 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <HeartIcon
                onClick={handleFavoriteClick}
                className={cn(
                  "text-red-500 cursor-pointer hover:scale-110 transition-transform w-4 md:w-6 h-4 md:h-6 lg:w-8 lg:h-8",
                  item.isFavorite ? "text-red-500 fill-red-500" : "",
                )}
              />
              {isOwner && (
                <RecipeActions
                  recipeId={item._id}
                  isOwner={isOwner}
                  variant="card"
                  onDelete={onDelete}
                />
              )}
            </CardAction>
          </div>
        </div>
        <RecipeBadges recipe={item} />
      </div>
    </Card>
  );
};

export default RecipeCard;
