"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { useGlobalContext } from "@/context";
import { discoverMockData } from "@/mockData/data";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/mockData/constatnts";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/discover/SearchBar";
import { RecipeItem } from "@/types";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import FilterContent from "@/components/filter/FilterContent";
import { FilterTrigger } from "@/components/filter/FilterTrigger";
import { totalPages } from "@/utilities/helperFunction";
import { useEffect, useState } from "react";

const Discover = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsToRender, setItemsToRender] = useState<RecipeItem[]>([]);

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
      <div className="flex items-center">
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
          {/* <FilterContent /> */}
          <FilterTrigger />
        </div>
        <div className="flex-[1]">
          <SearchBar />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {itemsToRender.map((item: RecipeItem) => (
          <RecipeCard key={item.id} item={item} />
        ))}
      </div>
      Test
      <PaginationComponent
        totalPages={totalPages(discoverMockData, ITEMS_PER_PAGE)}
        currentPage={currentPage}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default Discover;
