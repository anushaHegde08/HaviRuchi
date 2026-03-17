import { Clock, ForkKnife, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecipeItem } from "@/types";

const getBadges = (recipe: RecipeItem) => [
  {
    label: recipe.category,
    color:
      "text-green-500 border-green-500 bg-green-500/5 hover:bg-green-500/20",
  },
  {
    label: recipe.difficulty,
    color:
      "text-orange-500  border-orange-200  bg-orange-50/5 hover:bg-orange-500/20",
    icon: <ForkKnife className="h-3 w-3" />,
  },
  {
    label: `${recipe.servings} Servings`,
    color: "text-pink-500   border-pink-200 bg-pink-50/5 hover:bg-pink-500/20",
    icon: <Users className="h-3 w-3" />,
  },
  {
    label: recipe.timeNeeded,
    color: "text-blue-500 border-blue-200 bg-blue-50/5 hover:bg-blue-500/20",
    icon: <Clock className="h-3 w-3" />,
  },
];

export const RecipeBadges = ({ recipe }: { recipe: RecipeItem }) => (
  <div className="flex flex-wrap gap-2">
    {getBadges(recipe).map((badge) => (
      <span
        key={badge.label}
        className={cn(
          "flex items-center gap-1 text-xs px-3 py-1 rounded-full border",
          badge.color,
        )}
      >
        {badge.icon}
        {badge.label}
      </span>
    ))}
  </div>
);
