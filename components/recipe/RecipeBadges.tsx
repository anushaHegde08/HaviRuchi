import {
  formatTime,
  getRecipeDisplayCategory,
} from "@/lib/utilities/helperFunction";
import { cn } from "@/lib/utils";
import { RecipeItem } from "@/types";
import { Clock, ForkKnife } from "lucide-react";

const categoryColors: Record<string, string> = {
  Breakfast: "bg-amber-50 text-amber-700 border-amber-200",
  "Main Course": "bg-green-50 text-green-700 border-green-200",
  Sides: "bg-blue-50 text-blue-700 border-blue-200",
  Snack: "bg-orange-50 text-orange-700 border-orange-200",
  Sweets: "bg-pink-50 text-pink-700 border-pink-200",
  Beverage: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Hard: "bg-red-50 text-red-700 border-red-200",
};

const getBadges = (recipe: RecipeItem, variant: "card" | "detail") => [
  {
    label:
      variant === "detail"
        ? recipe.subCategory &&
          recipe.subCategory.trim() !== "" &&
          recipe.subCategory !== "Other" &&
          !recipe.subCategory.includes(":Other")
          ? `${recipe.category} - ${recipe.subCategory}`
          : recipe.category
        : getRecipeDisplayCategory(recipe),
    color:
      categoryColors[recipe.category] ??
      "bg-muted text-muted-foreground border-border",
  },
  {
    label: recipe.difficulty,
    color:
      difficultyColors[recipe.difficulty] ??
      "bg-muted text-muted-foreground border-border",
    icon: <ForkKnife className="h-3 md:h-4 lg:h-5 w-3 md:w-4 lg:w-5" />,
  },
  {
    label: formatTime(recipe.timeNeeded),
    color: "text-blue-500 border-blue-200 bg-blue-50/5",
    icon: <Clock className="h-3 md:h-4 lg:h-5 w-3 md:w-4 lg:w-5" />,
  },
];

export const RecipeBadges = ({
  recipe,
  variant = "card",
}: {
  recipe: RecipeItem;
  variant?: "card" | "detail";
}) => (
  <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5">
    {getBadges(recipe, variant).map((badge) => (
      <span
        key={badge.label}
        className={cn(
          "flex flex-shrink-0 items-center gap-1 text-[8px] md:text-base lg:text-lg py-0.5 px-2 rounded-full border",
          badge.color,
        )}
      >
        {badge.icon}
        <div className="text-nowrap"> {badge.label}</div>
      </span>
    ))}
  </div>
);
