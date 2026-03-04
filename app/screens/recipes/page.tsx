import RecipeCard, { RecipeItem } from "@/components/discover/RecipeCard";
import { discoverMockData } from "@/mockData/data";

const Recipes = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {discoverMockData.map((item: RecipeItem) => (
          <RecipeCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default Recipes;
