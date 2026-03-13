"use client";
import React from "react";
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

interface RecipeCardProps {
  item: RecipeItem;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ item }) => {
  return (
    <Card className="flex">
      <img
        src="/images/image1.png"
        alt={item.title}
        className="flex-[1] object-cover overflow-auto rounded-s-xl"
      />
      <div className="flex-[3]">
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription className="text-secondary/70">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between">
          <Badge tone="category">{item.category}</Badge>
          <Badge tone="time">
            <Clock className="stroke-1 size-5" />
            {item.timeNeeded}
          </Badge>
          <Badge tone="hard">{item.difficulty}</Badge>
          <Badge tone="servings">{item.servings} servings</Badge>
        </CardContent>
        {/* <CardAction className="flex justify-start">
                <Button>View Recipe</Button>
              </CardAction> */}
      </div>
      <CardAction
        onClick={() =>
          toast.success("Recipe successfully added to your Favorites", {
            position: "top-right",
          })
        }
      >
        <HeartIcon
          className={item.isFavorite ? "text-red-500 fill-red-500" : ""}
        />
      </CardAction>
    </Card>
  );
};

export default RecipeCard;
