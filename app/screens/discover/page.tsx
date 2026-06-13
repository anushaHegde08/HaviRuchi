"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import SearchBar from "@/components/discover/SearchBar";
import { NoItemsFound } from "@/components/empty-state/NoItemsFound";
import { APIErrors } from "@/components/error-screens/APIErrors";
import { RecipeGridSkeleton } from "@/components/loading/RecipeCardSkeleton";
import { Badge } from "@/components/ui/badge";
import { useRecipes } from "@/hooks/useRecipes";
import { totalPages } from "@/lib/utilities/helperFunction";
import {
  CATEGORIES,
  ITEMS_PER_PAGE,
  MOBILE_LOAD_COUNT,
} from "@/mockData/constatnts";
import { defaultFilters, FilterState, RecipeItem } from "@/types";
import { DatabaseSearch } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

const LazyFilterTrigger = dynamic(
  () =>
    import("@/components/filter/FilterTrigger").then(
      (mod) => mod.FilterTrigger,
    ),
  {
    ssr: false,
    loading: () => <div className="h-8 w-20 animate-pulse rounded bg-muted" />,
  },
);

const Discover = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    allRecipes,
    setAllRecipes,
    handleToggleFavorite,
    onClickRecipeCard,
    loading,
    error,
    retryFetch,
  } = useRecipes();

  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_LOAD_COUNT);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
    setFilters((prev) => ({ ...prev, categories: [] }));
    setCurrentPage(0);
    setMobileVisibleCount(MOBILE_LOAD_COUNT);
  }, []);

  const handleApplyFilter = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setSelectedCategory("All");
    setCurrentPage(0);
    setMobileVisibleCount(MOBILE_LOAD_COUNT);
  }, []);

  const handleClearFilter = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedCategory("All");
    setCurrentPage(0);
    setMobileVisibleCount(MOBILE_LOAD_COUNT);
  }, []);

  const filteredRecipes = useMemo(
    () =>
      allRecipes.filter((recipe) => {
        const searchMatch =
          searchQuery === "" ||
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          recipe.category.toLowerCase().includes(searchQuery.toLowerCase());

        const badgeCategoryMatch =
          selectedCategory === "All" || recipe.category === selectedCategory;

        const categoryMatch =
          filters.categories.length === 0 ||
          filters.categories.includes(recipe.category);

        const difficultyMatch =
          filters.difficulties.length === 0 ||
          filters.difficulties.includes(recipe.difficulty);

        const timeMatch = recipe.timeNeeded <= filters.maxTime;

        return (
          searchMatch &&
          badgeCategoryMatch &&
          categoryMatch &&
          difficultyMatch &&
          timeMatch
        );
      }),
    [
      allRecipes,
      filters.categories,
      filters.difficulties,
      filters.maxTime,
      searchQuery,
      selectedCategory,
    ],
  );

  // const filteredRecipes = allRecipes;
  // paginate filtered results
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = filteredRecipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const mobileItems = filteredRecipes.slice(0, mobileVisibleCount);

  const handleLoadMore = useCallback(() => {
    setMobileVisibleCount((prev) => prev + MOBILE_LOAD_COUNT);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setAllRecipes(allRecipes.filter((r) => r._id !== id));
    },
    [allRecipes, setAllRecipes],
  );
  // reset to page 0 when filters change
  // useEffect(() => {
  //   setCurrentPage(0);
  //   // reset mobile count when filters/search change
  //   setMobileVisibleCount(MOBILE_LOAD_COUNT);
  // }, [filters, searchQuery, selectedCategory]);

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
          <LazyFilterTrigger
            filters={filters}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
        </div>
        <div className=" flex-[1]">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>
        <div className="md:hidden">
          <LazyFilterTrigger
            filters={filters}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
        </div>
      </div>
      {/* loading state */}
      {loading && <RecipeGridSkeleton count={ITEMS_PER_PAGE} />}

      {/* error state */}
      {error && (
        <APIErrors
          message="Failed to load recipes. Try again."
          onRetry={retryFetch}
        />
      )}

      {/* Mobile grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {mobileItems.length > 0 ? (
            mobileItems.map((item: RecipeItem, index: number) => (
              <RecipeCard
                key={item._id}
                item={item}
                priority={index < 3}
                onToggleFavorite={handleToggleFavorite}
                onClickRecipeCard={onClickRecipeCard}
                onDelete={() => handleDelete(item._id as string)}
              />
            ))
          ) : (
            <NoItemsFound
              icon={<DatabaseSearch className="h-8 w-8 text-primary" />}
              title="No recipes found"
              description="Try adjusting your search or filters"
            />
          )}
        </div>
      )}

      {/* Desktop grid */}
      {!loading && !error && (
        <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {itemsToRender.length > 0 ? (
            itemsToRender.map((item: RecipeItem, index: number) => (
              <RecipeCard
                key={item._id}
                item={item}
                priority={index < 3}
                onToggleFavorite={handleToggleFavorite}
                onClickRecipeCard={onClickRecipeCard}
                onDelete={() => handleDelete(item._id as string)}
              />
            ))
          ) : (
            <div className="col-span-2">
              <NoItemsFound
                icon={<DatabaseSearch className="h-8 w-8 text-primary" />}
                title="No recipes found"
                description="Try adjusting your search or filters"
              />
            </div>
          )}
        </div>
      )}

      {itemsToRender.length > 0 && !loading ? (
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
