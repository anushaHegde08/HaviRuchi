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
    <Card className="grid grid-cols-6 gap-2">
      <img
        src={
          item.image && item.image !== ""
            ? item.image
            : "/images/placeholder.png"
        }
        alt={item.title}
        className="col-span-2 h-[100%] object-cover overflow-auto rounded-s-xl"
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.jpg";
        }}
      />
      <div
        className="col-span-4 p-1 flex flex-col justify-between "
        onClick={() => onClickRecipeCard(item.id)}
      >
        <div className="grid grid-cols-6 mb-1">
          <div id="Details" className="col-span-5">
            <CardHeader className="p-0">
              <CardTitle className="text-sm md:text-lg lg:text-xl pb-1">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-xs md:text-lg lg:text-xl text-secondary/70 leading-1 line-clamp-3">
                {item.description}
              </CardDescription>
            </CardContent>
          </div>
          <div id="Actions" className="col-span-1">
            <CardAction
              className="flex flex-col items-center justify-between border-t-0 p-0"
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
                  recipeId={item.id}
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
    // <Card className="flex transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
    //   <img
    //     src={
    //       item.image && item.image !== ""
    //         ? item.image
    //         : "/images/placeholder.png"
    //     }
    //     alt={item.title}
    //     className="object-cover overflow-auto rounded-s-xl w-[100px] h-[100px]"
    //     onError={(e) => {
    //       e.currentTarget.src = "/images/placeholder.jpg";
    //     }}
    //   />
    //   <div
    //     onClick={() => {
    //       onClickRecipeCard(item.id);
    //     }}
    //   >
    //     <CardHeader id="test" className="cursor-pointer flex flex-row p-2">
    //       <div className="flex-grow">
    //         <CardTitle className="text-sm md:text-lg lg:text-xl pb-1">
    //           {item.title}
    //         </CardTitle>
    //         <CardDescription className="text-xs md:text-lg lg:text-xl text-secondary/70 leading-1 line-clamp-3">
    //           {item.description}
    //         </CardDescription>
    //       </div>
    //       <CardAction
    //         className="flex flex-col items-center justify-between border-t-0 p-0"
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         <HeartIcon
    //           onClick={handleFavoriteClick}
    //           className={cn(
    //             "cursor-pointer hover:scale-110 transition-transform",
    //             item.isFavorite ? "text-red-500 fill-red-500" : "",
    //           )}
    //         />
    //         {isOwner && (
    //           <CardContent>
    //             <RecipeActions
    //               recipeId={item.id}
    //               isOwner={isOwner}
    //               variant="card"
    //               onDelete={onDelete}
    //             />
    //           </CardContent>
    //         )}
    //       </CardAction>
    //     </CardHeader>
    //     <CardContent className="flex justify-between px-2 py-0">
    //       <RecipeBadges recipe={item} />
    //     </CardContent>
    //   </div>
    // </Card>
  );
};

export default RecipeCard;
