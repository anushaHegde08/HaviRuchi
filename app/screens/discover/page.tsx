import PaginationComponent from "@/components/discover/Pagination";
import RecipeCard, { RecipeItem } from "@/components/discover/RecipeCard";
import SearchBar from "@/components/discover/SearchBar";
import { Typography } from "@/components/ui/typography";
import { discoverMockData } from "@/mockData/data";

const Discover = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center pt-4">
        <Typography
          variant="body"
          weight="bold"
          color="primary"
          className="flex-[2] sm:text-lg md:text-xl"
        >
          Discover Recipes
        </Typography>
        <div className="flex-[3]">
          <SearchBar />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {discoverMockData.map((item: RecipeItem) => (
          <RecipeCard key={item.id} item={item} />
        ))}
      </div>
      <PaginationComponent />
    </div>
  );
};

export default Discover;
