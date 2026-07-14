"use client";
import { useIsOwner } from "@/hooks/useIsOwner";
import { cn } from "@/lib/utils";
import { RecipeItem } from "@/types";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import RecipeActions from "../recipe/RecipeActions";
import { RecipeBadges } from "../recipe/RecipeBadges";
import { RecipeStatusNote } from "../recipe/RecipeStatusNote";
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
  showActions?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  item,
  onToggleFavorite,
  onClickRecipeCard,
  onDelete,
  priority = false,
  showActions = false,
}) => {
  const isOwner = useIsOwner(item);

  const handleFavoriteClick = () => {
    onToggleFavorite(item._id);
  };

  return (
    <Card
      className="relative overflow-visible grid grid-cols-6 gap-2 cursor-pointer transition-all duration-200 hover:shadow-[0_8px_25px_rgba(239,99,81,0.18)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-primary/[0.03]"
      onClick={() => onClickRecipeCard(item._id)}
    >
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
      {!showActions && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick();
          }}
          className="absolute top-2 right-2 z-10 cursor-pointer hover:scale-110 transition-transform"
        >
          <HeartIcon
            className={cn(
              "w-4 h-4 md:w-5 md:h-5",
              item.isFavorite
                ? "text-red-500 fill-red-500"
                : "text-muted-foreground",
            )}
          />
        </button>
      )}
      <div className="col-span-4 min-w-0 py-1 flex flex-col justify-between">
        <div className="grid grid-cols-6">
          <div
            id="Details"
            className={cn("min-w-0", showActions ? "col-span-5" : "col-span-6")}
          >
            <CardHeader className="p-0">
              <CardTitle className="text-sm md:text-2xl lg:text-2xl truncate flex items-center gap-2">
                {item.title.length > 20
                  ? `${item.title.slice(0, 18)}...`
                  : item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-xs md:text-xl text-secondary/70 line-clamp-2 md:line-clamp-3 break-words whitespace-pre-wrap">
                {item.description}
              </CardDescription>
              {!showActions && item.createdBy?.name && (
                <p className="text-[10px] md:text-sm text-muted-foreground mt-1">
                  by {item.createdBy.name}
                </p>
              )}
            </CardContent>
          </div>
          {showActions && (
            <div id="Actions" className="col-span-1">
              <CardAction
                className="flex flex-col items-center gap-1 md:gap-2 border-t-0 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <HeartIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteClick();
                  }}
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
          )}
        </div>
        {showActions ? (
          item.status && (
            <RecipeStatusNote
              status={item.status}
              reviewNote={item.reviewNote}
            />
          )
        ) : (
          <RecipeBadges recipe={item} />
        )}
      </div>
    </Card>
  );
};

export default RecipeCard;
