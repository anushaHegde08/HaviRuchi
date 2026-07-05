import { formatTime } from "@/lib/utilities/helperFunction";
import { cn } from "@/lib/utils";
import { RecipeItem } from "@/types";
import { Clock, ForkKnife, Users } from "lucide-react";

const getBadges = (recipe: RecipeItem, showServings: boolean) => [
  {
    label: recipe.category,
    color:
      "text-yellow-500 border-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/20",
  },
  {
    label: recipe.difficulty,
    color:
      "text-orange-500 border-orange-200 bg-orange-50/5 hover:bg-orange-500/20",
    icon: <ForkKnife className="h-3 md:h-4 lg:h-5 w-3 md:w-4 lg:w-5" />,
  },
  ...(showServings
    ? [
        {
          label: `${recipe.servings} Servings`,
          color:
            "text-pink-500 border-pink-200 bg-pink-50/5 hover:bg-pink-500/20",
          icon: <Users className="h-3 md:h-4 lg:h-5 w-3 md:w-4 lg:w-5" />,
        },
      ]
    : []),
  {
    label: formatTime(recipe.timeNeeded),
    color: "text-blue-500 border-blue-200 bg-blue-50/5 hover:bg-blue-500/20",
    icon: <Clock className="h-3 md:h-4 lg:h-5 w-3 md:w-4 lg:w-5" />,
  },
];

export const RecipeBadges = ({
  recipe,
  showServings = false,
}: {
  recipe: RecipeItem;
  showServings?: boolean;
}) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-200 scrollbar-track-transparent pb-1">
    {getBadges(recipe, showServings).map((badge) => (
      <span
        key={badge.label}
        className={cn(
          "flex flex-shrink-0 items-center gap-1 text-[8px] md:text-base lg:text-lg px-3 rounded-full border",
          badge.color,
        )}
      >
        {badge.icon}
        <div className="text-nowrap"> {badge.label}</div>
      </span>
    ))}
  </div>
);
