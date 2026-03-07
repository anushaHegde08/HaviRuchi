"use client";
import PaginationComponent from "@/components/discover/Pagination";
import RecipeCard, { RecipeItem } from "@/components/discover/RecipeCard";
import { useGlobalContext } from "@/context";
import { discoverMockData } from "@/mockData/data";
import SearchOverlay from "../search-overlay/page";
import { categories } from "@/mockData/constatnts";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/discover/SearchBar";

const Discover = () => {
  const totalPages = Math.ceil(discoverMockData.length / 10);
  const currentPage = 2;
  const { searchOpen, setSearchOpen } = useGlobalContext();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center">
        <div className="flex flex-[2] items-center gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              tone={category === "All" ? "selected" : "unselected"}
            >
              {category}
            </Badge>
          ))}
        </div>
        <div className="flex-[1]">
          <SearchBar />
        </div>
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

export default Discover;
