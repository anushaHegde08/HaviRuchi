"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, HeartIcon } from "lucide-react";
import { RecipeItem } from "@/types";
import { toast } from "sonner";
import { RecipeBadges } from "../recipe/RecipeBadges";
import RecipeActions from "../recipe/RecipeActions";
import { useIsOwner } from "@/hooks/useIsOwner";
import { cn } from "@/lib/utils";

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
    onToggleFavorite(item.id);
  };

  return (
    <Card className="flex transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <img
        src={
          item.image && item.image !== ""
            ? item.image
            : "/images/placeholder.png"
        }
        alt={item.title}
        className="flex-[1] object-cover overflow-auto rounded-s-xl"
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.jpg";
        }}
      />
      <div
        className="flex-[3]"
        onClick={() => {
          onClickRecipeCard(item.id);
        }}
      >
        <CardHeader className="cursor-pointer">
          <CardTitle className="md:text-lg lg:text-xl">{item.title}</CardTitle>
          <CardDescription className="md:text-lg lg:text-xl text-secondary/70">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between">
          <RecipeBadges recipe={item} />
        </CardContent>
      </div>
      <CardAction
        className="flex flex-col items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <HeartIcon
          onClick={handleFavoriteClick}
          className={cn(
            "cursor-pointer hover:scale-110 transition-transform",
            item.isFavorite ? "text-red-500 fill-red-500" : "",
          )}
        />
        {isOwner && (
          <RecipeActions
            recipeId={item.id as string}
            isOwner={isOwner}
            variant="card"
            onDelete={onDelete}
          />
        )}
      </CardAction>
    </Card>
  );
};

export default RecipeCard;
