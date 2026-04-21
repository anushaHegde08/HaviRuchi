"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { discoverMockData } from "@/mockData/data";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/mockData/constatnts";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/discover/SearchBar";
import { RecipeItem } from "@/types";
import { FilterTrigger } from "@/components/filter/FilterTrigger";
import { totalPages } from "@/utilities/helperFunction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Discover = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsToRender, setItemsToRender] =
    useState<RecipeItem[]>(discoverMockData);
  const router = useRouter();

  const toggleFavorite = (id: number) => {
    console.log(id);

    setItemsToRender((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
    console.log(itemsToRender);
  };

  useEffect(() => {
    let startIndex = currentPage * ITEMS_PER_PAGE;
    const itemsToRender = discoverMockData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
    console.log(startIndex, itemsToRender);
    setItemsToRender(itemsToRender);
  }, [currentPage]);

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex items-center gap-4 md:gap-0">
        <div className="hidden md:flex flex-[2] items-center gap-2">
          {CATEGORIES.map((category, index) =>
            index >= 5 ? null : (
              <Badge
                key={index}
                tone={category === "All" ? "selected" : "unselected"}
                className="text-sm"
              >
                {category}
              </Badge>
            ),
          )}
          <FilterTrigger />
        </div>
        <div className=" flex-[1]">
          <SearchBar />
        </div>
        <div className="md:hidden">
          <FilterTrigger />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {itemsToRender.map((item: RecipeItem) => (
          <RecipeCard
            key={item.id}
            item={item}
            onToggleFavorite={toggleFavorite}
            onClickRecipeCard={(id: number) =>
              router.push("/screens/recipe/" + id)
            }
          />
        ))}
      </div>

      <PaginationComponent
        totalPages={totalPages(discoverMockData, ITEMS_PER_PAGE)}
        currentPage={currentPage}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default Discover;
