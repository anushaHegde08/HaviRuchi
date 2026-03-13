import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { Typography } from "@/components/ui/typography";
import { ITEMS_PER_PAGE } from "@/mockData/constatnts";
import { discoverMockData } from "@/mockData/data";
import { RecipeItem } from "@/types";
import { favoriteRecipesLength, totalPages } from "@/utilities/helperFunction";

const Favorites = () => {
  return (
    <div className="flex flex-col gap-4 px-6">
      <Typography variant="h3" color="primary" weight="semibold">
        Favorite Recipes
      </Typography>
      <Typography variant="body" color="text" className="italic">
        You have {favoriteRecipesLength(discoverMockData)} Favorite Recipes
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {discoverMockData.map(
          (item: RecipeItem) =>
            item.isFavorite && <RecipeCard key={item.id} item={item} />,
        )}
      </div>
      <PaginationComponent
        totalPages={totalPages(discoverMockData, ITEMS_PER_PAGE)}
        currentPage={1}
      />
    </div>
  );
};

export default Favorites;
