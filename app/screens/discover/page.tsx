"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { discoverMockData } from "@/mockData/data";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/mockData/constatnts";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/discover/SearchBar";
import { defaultFilters, FilterState, RecipeItem } from "@/types";
import { FilterTrigger } from "@/components/filter/FilterTrigger";
import { totalPages } from "@/utilities/helperFunction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Discover = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [allRecipes, setAllRecipes] = useState<RecipeItem[]>(discoverMockData);

  const router = useRouter();

  const filteredRecipes = allRecipes.filter((recipe) => {
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(recipe.category);

    const difficultyMatch =
      filters.difficulties.length === 0 ||
      filters.difficulties.includes(recipe.difficulty);

    const timeMatch = recipe.timeNeeded <= filters.maxTime;

    return categoryMatch && difficultyMatch && timeMatch;
  });

  // paginate filtered results
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = filteredRecipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const toggleFavorite = (id: number) => {
    setAllRecipes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  // reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

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
          <FilterTrigger
            filters={filters}
            onApply={setFilters}
            onClear={() => setFilters(defaultFilters)}
          />
        </div>
        <div className=" flex-[1]">
          <SearchBar />
        </div>
        <div className="md:hidden">
          <FilterTrigger
            filters={filters}
            onApply={setFilters}
            onClear={() => setFilters(defaultFilters)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {itemsToRender.length > 0 ? (
          itemsToRender.map((item: RecipeItem) => (
            <RecipeCard
              key={item.id}
              item={item}
              onToggleFavorite={toggleFavorite}
              onClickRecipeCard={(id: number) =>
                router.push("/screens/recipe/" + id)
              }
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-2 text-center py-12">
            No recipes found for the selected filters.
          </p>
        )}
      </div>
      {itemsToRender.length > 0 ? (
        <PaginationComponent
          totalPages={totalPages(filteredRecipes, ITEMS_PER_PAGE)}
          currentPage={currentPage}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      ) : null}
    </div>
  );
};

export default Discover;
