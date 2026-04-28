"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { discoverMockData } from "@/mockData/data";
import {
  CATEGORIES,
  ITEMS_PER_PAGE,
  MOBILE_LOAD_COUNT,
} from "@/mockData/constatnts";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/discover/SearchBar";
import { defaultFilters, FilterState, RecipeItem } from "@/types";
import { FilterTrigger } from "@/components/filter/FilterTrigger";
import { totalPages } from "@/lib/utilities/helperFunction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecipes } from "@/hooks/useRecipes";

const Discover = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  // const [allRecipes, setAllRecipes] = useState<RecipeItem[]>(discoverMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { allRecipes, toggleFavorite, onClickRecipeCard } = useRecipes();

  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_LOAD_COUNT);

  const router = useRouter();

  // handle badge click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    console.log(category, selectedCategory);

    // clear filter categories when badge is clicked
    setFilters((prev) => ({ ...prev, categories: [] }));
  };

  // handle filter apply — clear selected badge
  const handleApplyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    setSelectedCategory("All");
  };

  // handle filter clear
  const handleClearFilter = () => {
    setFilters(defaultFilters);
    setSelectedCategory("All");
  };

  const filteredRecipes = allRecipes.filter((recipe) => {
    // search across title, description, category
    const searchMatch =
      searchQuery === "" ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase());

    // badge category filter
    const badgeCategoryMatch =
      selectedCategory === "All" || recipe.category === selectedCategory;

    // filter panel category filter
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(recipe.category);

    // difficulty filter
    const difficultyMatch =
      filters.difficulties.length === 0 ||
      filters.difficulties.includes(recipe.difficulty);

    // time filter
    const timeMatch = recipe.timeNeeded <= filters.maxTime;

    return (
      searchMatch &&
      badgeCategoryMatch &&
      categoryMatch &&
      difficultyMatch &&
      timeMatch
    );
  });

  // paginate filtered results
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = filteredRecipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // const toggleFavorite = (id: number) => {
  //   setAllRecipes((prev) =>
  //     prev.map((item) =>
  //       item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
  //     ),
  //   );
  // };

  const mobileItems = filteredRecipes.slice(0, mobileVisibleCount);

  const handleLoadMore = () => {
    setMobileVisibleCount((prev) => prev + MOBILE_LOAD_COUNT);
  };

  // reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
    // reset mobile count when filters/search change
    setMobileVisibleCount(MOBILE_LOAD_COUNT);
  }, [filters, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex items-center gap-4 md:gap-0">
        <div className="hidden md:flex flex-[2] items-center gap-2">
          {CATEGORIES.map((category, index) =>
            index >= 5 ? null : (
              <Badge
                key={index}
                tone={category === selectedCategory ? "selected" : "unselected"}
                className="text-sm cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Badge>
            ),
          )}
          <FilterTrigger
            filters={filters}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
        </div>
        <div className=" flex-[1]">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="md:hidden">
          <FilterTrigger
            filters={filters}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {mobileItems.length > 0 ? (
          mobileItems.map((item: RecipeItem) => (
            <RecipeCard
              key={item.id}
              item={item}
              onToggleFavorite={toggleFavorite}
              onClickRecipeCard={onClickRecipeCard}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-12">
            No recipes found.
          </p>
        )}
      </div>
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {itemsToRender.length > 0 ? (
          itemsToRender.map((item: RecipeItem) => (
            <RecipeCard
              key={item.id}
              item={item}
              onToggleFavorite={toggleFavorite}
              onClickRecipeCard={onClickRecipeCard}
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
          allFilteredRecipes={filteredRecipes}
          visibleItems={mobileVisibleCount}
          onLoadMore={handleLoadMore}
        />
      ) : null}
    </div>
  );
};

export default Discover;
