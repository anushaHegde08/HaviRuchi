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

interface RecipeCardProps {
  item: RecipeItem;
  onToggleFavorite: (id: number) => void;
  onClickRecipeCard: (id: number) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  item,
  onToggleFavorite,
  onClickRecipeCard,
}) => {
  return (
    <Card
      className="flex"
      onClick={() => {
        onClickRecipeCard(item.id);
        console.log(item);
      }}
    >
      <img
        src="/images/image1.png"
        alt={item.title}
        className="flex-[1] object-cover overflow-auto rounded-s-xl"
      />
      <div className="flex-[3]">
        <CardHeader>
          <CardTitle className="md:text-lg">{item.title}</CardTitle>
          <CardDescription className="md:text-lg text-secondary/70">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between">
          <RecipeBadges recipe={item} />
        </CardContent>
      </div>
      <CardAction
        onClick={() => {
          const updatedFavorite = !item.isFavorite;
          onToggleFavorite(item.id);
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
      >
        <HeartIcon
          className={item.isFavorite ? "text-red-500 fill-red-500" : ""}
        />
      </CardAction>
    </Card>
  );
};

export default RecipeCard;
