"use client";
import { useIsOwner } from "@/hooks/useIsOwner";
import { cn } from "@/lib/utils";
import { RecipeItem } from "@/types";
import { HeartIcon } from "lucide-react";
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
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  item,
  onToggleFavorite,
  onClickRecipeCard,
  onDelete,
}) => {
  const isOwner = useIsOwner(item);

  const handleFavoriteClick = () => {
    onToggleFavorite(item._id);
  };

  return (
    <Card className="grid grid-cols-6 gap-2">
      <img
        src={
          item.image && item.image !== ""
            ? item.image
            : "/images/placeholder.png"
        }
        alt={item.title}
        className="col-span-2 h-[100px] md:h-[190px] object-cover overflow-auto rounded-s-xl"
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.jpg";
        }}
      />
      <div
        className="col-span-4 py-1 flex flex-col justify-between cursor-pointer"
        onClick={() => onClickRecipeCard(item._id)}
      >
        <div className="grid grid-cols-6">
          <div id="Details" className="col-span-5">
            <CardHeader className="p-0">
              <CardTitle className="text-sm md:text-2xl lg:text-2xl">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-xs md:text-xl lg:text-xl text-secondary/70 leading-1 line-clamp-3 md:line-clamp-4">
                {item.description}
              </CardDescription>
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
