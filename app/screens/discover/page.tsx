"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { useGlobalContext } from "@/context";
import { discoverMockData } from "@/mockData/data";
import { CATEGORIES } from "@/mockData/constatnts";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/discover/SearchBar";
import { RecipeItem } from "@/types";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import FilterContent from "@/components/filter/FilterContent";

const Discover = () => {
  const totalPages = Math.ceil(discoverMockData.length / 10);
  const currentPage = 2;
  const { searchOpen, setSearchOpen } = useGlobalContext();
  const { filterOpen, setFilterOpen } = useGlobalContext();

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {/* {filterOpen && <FilterContent />} */}
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
          <FilterContent />
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
