import PaginationComponent from "@/components/discover/Pagination";
import RecipeCard, { RecipeItem } from "@/components/discover/RecipeCard";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { categories } from "@/mockData/constatnts";
import { discoverMockData } from "@/mockData/data";

const Recipes = () => {
  const totalPages = Math.ceil(discoverMockData.length / 10);
  const currentPage = 2;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center pt-4">
        <Typography
          variant="body"
          weight="bold"
          color="primary"
          className="flex-[2] sm:text-lg md:text-xl"
        >
          All Recipes
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            tone={category === "All" ? "selected" : "unselected"}
          >
            {category}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {discoverMockData.map((item: RecipeItem) => (
          <RecipeCard key={item.id} item={item} />
        ))}
      </div>
      <PaginationComponent totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default Recipes;
