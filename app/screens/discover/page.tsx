"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import SearchBar from "@/components/discover/SearchBar";
import { NoItemsFound } from "@/components/empty-state/NoItemsFound";
import { APIErrors } from "@/components/error-screens/APIErrors";
import { FilterTrigger } from "@/components/filter/FilterTrigger";
import { RecipeGridSkeleton } from "@/components/loading/RecipeCardSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalContext } from "@/context/globalContext";
import { useRecipes } from "@/hooks/useRecipes";
import {
  CATEGORIES,
  ITEMS_PER_PAGE,
  MOBILE_LOAD_COUNT,
} from "@/lib/utilities/constatnts";
import { totalPages } from "@/lib/utilities/helperFunction";
import { defaultBadgeFilters, defaultPanelFilters, PanelFilterState, RecipeItem } from "@/types";
import { DatabaseSearch, ChevronDown } from "lucide-react";
import { useCallback, useMemo } from "react";

const Discover = () => {
  const {
    discoverSearchQuery: searchQuery,
    setDiscoverSearchQuery: setSearchQuery,
    activeFilterMode,
    setActiveFilterMode,
    badgeFilters,
    setBadgeFilters,
    panelFilters,
    setPanelFilters,
    discoverCurrentPage: currentPage,
    setDiscoverCurrentPage: setCurrentPage,
    discoverMobileVisibleCount: mobileVisibleCount,
    setDiscoverMobileVisibleCount: setMobileVisibleCount,
  } = useGlobalContext();

  const {
    allRecipes,
    handleToggleFavorite,
    onClickRecipeCard,
    loading,
    error,
    retryFetch,
  } = useRecipes();

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
    },
    [setSearchQuery],
  );

  const handleCategoryClick = useCallback(
    (category: string) => {
      setActiveFilterMode("badge");
      setBadgeFilters({ category, subCategory: "All" });
      setPanelFilters(defaultPanelFilters);
      setCurrentPage(0);
      setMobileVisibleCount(MOBILE_LOAD_COUNT);
    },
    [setActiveFilterMode, setBadgeFilters, setPanelFilters, setCurrentPage, setMobileVisibleCount],
  );

  const handleSubCategoryClick = useCallback(
    (subCategory: string) => {
      setActiveFilterMode("badge");
      setBadgeFilters((prev) => ({ ...prev, subCategory }));
      setCurrentPage(0);
      setMobileVisibleCount(MOBILE_LOAD_COUNT);
    },
    [setActiveFilterMode, setBadgeFilters, setCurrentPage, setMobileVisibleCount],
  );

  const handleApplyFilter = useCallback(
    (newFilters: PanelFilterState) => {
      setActiveFilterMode("panel");
      setPanelFilters(newFilters);
      setBadgeFilters(defaultBadgeFilters);
      setCurrentPage(0);
      setMobileVisibleCount(MOBILE_LOAD_COUNT);
    },
    [setActiveFilterMode, setPanelFilters, setBadgeFilters, setCurrentPage, setMobileVisibleCount],
  );

  const handleClearFilter = useCallback(() => {
    setActiveFilterMode("badge");
    setBadgeFilters({ category: "All", subCategory: "All" });
    setPanelFilters(defaultPanelFilters);
    setCurrentPage(0);
    setMobileVisibleCount(MOBILE_LOAD_COUNT);
  }, [setActiveFilterMode, setBadgeFilters, setPanelFilters, setCurrentPage, setMobileVisibleCount]);

  const filteredRecipes = useMemo(
    () =>
      allRecipes.filter((recipe) => {
        const searchMatch =
          searchQuery === "" ||
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (recipe.subCategory && recipe.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));

        const MAIN_COURSE_SUBCATS = ["Tambuli", "Sasive", "Majjige Huli", "Hasi", "Sambar", "Saaru"];
        const SIDES_SUBCATS = ["Chatni", "Palya", "Kosambari"];

        let categoryMatch = true;
        let difficultyMatch = true;
        let timeMatch = true;

        if (activeFilterMode === "badge") {
          if (badgeFilters.category !== "All" && recipe.category !== badgeFilters.category) {
            categoryMatch = false;
          }
          if (badgeFilters.subCategory !== "All") {
            if (badgeFilters.subCategory === "Main Course:Other" || badgeFilters.subCategory === "Sides:Other" || badgeFilters.subCategory === "Other") {
              const list = badgeFilters.category === "Main Course" ? MAIN_COURSE_SUBCATS : (badgeFilters.category === "Sides" ? SIDES_SUBCATS : []);
              if (!recipe.subCategory || list.includes(recipe.subCategory)) categoryMatch = false;
            } else {
              if (recipe.subCategory !== badgeFilters.subCategory) categoryMatch = false;
            }
          }
        } else if (activeFilterMode === "panel") {
          const activeCategories = panelFilters.categories.filter((c) => c !== "All");
          if (activeCategories.length > 0 && !activeCategories.includes(recipe.category)) {
            categoryMatch = false;
          }
          
          if (categoryMatch) {
            if (recipe.category === "Main Course" && panelFilters.mainCourseSubCategories.length > 0) {
              let subcatMatches = false;
              if (recipe.subCategory && panelFilters.mainCourseSubCategories.includes(recipe.subCategory)) subcatMatches = true;
              if (panelFilters.mainCourseSubCategories.includes("Main Course:Other")) {
                if (recipe.subCategory && !MAIN_COURSE_SUBCATS.includes(recipe.subCategory)) subcatMatches = true;
              }
              if (!subcatMatches) categoryMatch = false;
            } else if (recipe.category === "Sides" && panelFilters.sidesSubCategories.length > 0) {
              let subcatMatches = false;
              if (recipe.subCategory && panelFilters.sidesSubCategories.includes(recipe.subCategory)) subcatMatches = true;
              if (panelFilters.sidesSubCategories.includes("Sides:Other")) {
                if (recipe.subCategory && !SIDES_SUBCATS.includes(recipe.subCategory)) subcatMatches = true;
              }
              if (!subcatMatches) categoryMatch = false;
            }
          }

          if (panelFilters.difficulties.length > 0 && !panelFilters.difficulties.includes(recipe.difficulty)) {
            difficultyMatch = false;
          }
          if (recipe.timeNeeded > panelFilters.maxTime) {
            timeMatch = false;
          }
        }

        return (
          searchMatch &&
          categoryMatch &&
          difficultyMatch &&
          timeMatch
        );
      }),
    [
      allRecipes,
      activeFilterMode,
      badgeFilters.category,
      badgeFilters.subCategory,
      panelFilters.categories,
      panelFilters.mainCourseSubCategories,
      panelFilters.sidesSubCategories,
      panelFilters.difficulties,
      panelFilters.maxTime,
      searchQuery,
    ],
  );

  // paginate filtered results
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = filteredRecipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const mobileItems = filteredRecipes.slice(0, mobileVisibleCount);

  const handleLoadMore = useCallback(() => {
    setMobileVisibleCount((prev) => prev + MOBILE_LOAD_COUNT);
  }, [setMobileVisibleCount]);

  const renderCategoryBadges = () => (
    <>
      {CATEGORIES.map((category, index) => {
        const hasSubCat = category === "Main Course" || category === "Sides";
        const isSelected = activeFilterMode === "badge" && category === badgeFilters.category;
        const subCats = category === "Main Course" 
          ? [
              { label: "Tambuli", value: "Tambuli" },
              { label: "Sasive", value: "Sasive" },
              { label: "Majjige Huli", value: "Majjige Huli" },
              { label: "Hasi", value: "Hasi" },
              { label: "Sambar", value: "Sambar" },
              { label: "Saaru", value: "Saaru" },
              { label: "Other", value: "Main Course:Other" },
            ]
          : [
              { label: "Chatni", value: "Chatni" },
              { label: "Palya", value: "Palya" },
              { label: "Kosambari", value: "Kosambari" },
              { label: "Other", value: "Sides:Other" },
            ];
            
        const badgeContent = (
          <Badge
            key={index}
            tone={isSelected ? "selected" : "unselected"}
            className="text-sm cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1"
            onClick={() => handleCategoryClick(category)}
            onPointerDown={() => handleCategoryClick(category)}
          >
            {isSelected && badgeFilters.subCategory !== "All" && hasSubCat 
              ? (() => {
                  const found = subCats.find(s => s.value === badgeFilters.subCategory);
                  return found ? `${category}: ${found.label}` : category;
                })()
              : category}
            {hasSubCat && <ChevronDown className="h-4 w-4" />}
          </Badge>
        );

        if (hasSubCat) {
          return (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger asChild>
                {badgeContent}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem 
                  onClick={() => {
                    handleSubCategoryClick("All");
                  }}
                >
                  All {category}
                </DropdownMenuItem>
                {subCats.map(subCat => (
                  <DropdownMenuItem 
                    key={subCat.value}
                    onClick={() => {
                      handleSubCategoryClick(subCat.value);
                    }}
                  >
                    {subCat.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        return badgeContent;
      })}
    </>
  );

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {/* DESKTOP LAYOUT (lg and up) */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex flex-[2] overflow-x-auto no-scrollbar items-center gap-2 pr-4 md:pr-0 pb-2">
          {renderCategoryBadges()}
          <FilterTrigger
            filters={panelFilters}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
        </div>
        <div className="flex-[1] pb-2">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>
      </div>

      {/* TABLET LAYOUT (md to lg) */}
      <div className="hidden md:flex lg:hidden flex-col gap-4">
        {/* Line 1: Search + Filter */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-[1]">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
          <div className="flex-shrink-0">
            <FilterTrigger
              filters={panelFilters}
              onApply={handleApplyFilter}
              onClear={handleClearFilter}
            />
          </div>
        </div>
        
        {/* Line 2: Categories with integrated Dropdown */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 flex flex-nowrap overflow-x-auto whitespace-nowrap items-center gap-2 no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
            {renderCategoryBadges()}
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT (< md) */}
      <div className="flex md:hidden items-center gap-2 w-full pb-2">
        <div className="flex-[1]">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>
        <div className="flex-shrink-0">
          <FilterTrigger
            filters={panelFilters}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
        </div>
      </div>
      {/* loading state */}
      {loading && !error && <RecipeGridSkeleton count={ITEMS_PER_PAGE} />}

      {/* error state */}
      {error && (
        <APIErrors
          onRetry={retryFetch}
          className="min-h-[400px] md:min-h-[400px]"
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
                priority={index < 2}
                onToggleFavorite={handleToggleFavorite}
                onClickRecipeCard={onClickRecipeCard}
              />
            ))
          ) : (
            <NoItemsFound
              icon={<DatabaseSearch className="h-8 w-8 text-primary" />}
              title="No recipes found"
              description="Try adjusting your search or filters"
              className="min-h-[400px] md:min-h-[400px]"
            />
          )}
        </div>
      )}

      {/* Desktop grid */}
      {!loading && !error && (
        <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {itemsToRender.length > 0 ? (
            itemsToRender.map((item: RecipeItem, index: number) => (
              <RecipeCard
                key={item._id}
                item={item}
                priority={index < 2}
                onToggleFavorite={handleToggleFavorite}
                onClickRecipeCard={onClickRecipeCard}
              />
            ))
          ) : (
            <div className="col-span-full">
              <NoItemsFound
                icon={<DatabaseSearch className="h-8 w-8 text-primary" />}
                title="No recipes found"
                description="Try adjusting your search or filters"
                className="min-h-[400px] md:min-h-[400px]"
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
