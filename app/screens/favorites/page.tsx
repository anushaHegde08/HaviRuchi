"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { Typography } from "@/components/ui/typography";
import { useRecipes } from "@/hooks/useRecipes";
import { ITEMS_PER_PAGE, MOBILE_LOAD_COUNT } from "@/mockData/constatnts";
import { discoverMockData } from "@/mockData/data";
import { RecipeItem } from "@/types";
import { totalPages } from "@/lib/utilities/helperFunction";
import { useEffect, useState } from "react";

const Favorites = () => {
  const { favoriteRecipes, toggleFavorite, onClickRecipeCard } = useRecipes();
  const [currentPage, setCurrentPage] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_LOAD_COUNT);

  useEffect(() => {
    setCurrentPage(0);
    setMobileVisibleCount(MOBILE_LOAD_COUNT);
  }, [favoriteRecipes.length]);

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = favoriteRecipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const mobileItems = favoriteRecipes.slice(0, mobileVisibleCount);

  return (
    <div className="flex flex-col gap-4 px-6">
      <Typography
        variant="h3"
        color="primary"
        weight="semibold"
        className="text-start"
      >
        Favorite Recipes
      </Typography>
      <Typography variant="body" color="text" className="italic text-start">
        You have {favoriteRecipes.length} Favorite Recipes
      </Typography>
      {favoriteRecipes.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No favorite recipes yet. Start adding some!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {mobileItems.map((item: RecipeItem) => (
              <RecipeCard
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                onClickRecipeCard={onClickRecipeCard}
              />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {itemsToRender.map((item: RecipeItem) => (
              <RecipeCard
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                onClickRecipeCard={onClickRecipeCard}
              />
            ))}
          </div>
          <PaginationComponent
            totalPages={totalPages(favoriteRecipes, ITEMS_PER_PAGE)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            allFilteredRecipes={favoriteRecipes}
            visibleItems={mobileVisibleCount}
            onLoadMore={() =>
              setMobileVisibleCount((prev) => prev + MOBILE_LOAD_COUNT)
            }
          />
        </>
      )}
    </div>
  );
};

export default Favorites;
