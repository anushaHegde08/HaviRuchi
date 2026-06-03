"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { NoItemsFound } from "@/components/empty-state/NoItemsFound";
import { RecipeGridSkeleton } from "@/components/loading/RecipeCardSkeleton";
import { Typography } from "@/components/ui/typography";
import { useRecipes } from "@/hooks/useRecipes";
import { totalPages } from "@/lib/utilities/helperFunction";
import { ITEMS_PER_PAGE, MOBILE_LOAD_COUNT } from "@/mockData/constatnts";
import { RecipeItem } from "@/types";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const Favorites = () => {
  const {
    favoriteRecipes,
    setAllRecipes,
    handleToggleFavorite,
    onClickRecipeCard,
    loading,
  } = useRecipes();
  const [currentPage, setCurrentPage] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_LOAD_COUNT);
  useSession();

  // useEffect(() => {
  //   setCurrentPage(0);
  //   setMobileVisibleCount(MOBILE_LOAD_COUNT);
  // }, [favoriteRecipes.length]);

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = favoriteRecipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const mobileItems = favoriteRecipes.slice(0, mobileVisibleCount);

  const handleDelete = (id: string) => {
    setAllRecipes(favoriteRecipes.filter((r) => r._id !== id));
    setCurrentPage(0);
    setMobileVisibleCount(MOBILE_LOAD_COUNT);
  };

  return (
    <>
      {loading ? (
        <RecipeGridSkeleton count={ITEMS_PER_PAGE} />
      ) : (
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
          {favoriteRecipes.length === 0 && !loading ? (
            <NoItemsFound
              icon={<Heart className="h-8 w-8 text-primary" />}
              title="No favorites yet"
              description="No favorite recipes yet. Start adding some!"
              actionLabel="Discover Recipes"
              actionHref="/screens/discover"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:hidden">
                {mobileItems.map((item: RecipeItem) => (
                  <RecipeCard
                    key={item._id}
                    item={item}
                    onToggleFavorite={handleToggleFavorite}
                    onClickRecipeCard={onClickRecipeCard}
                    onDelete={() => handleDelete(item._id as string)}
                  />
                ))}
              </div>
              <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {itemsToRender.map((item: RecipeItem) => (
                  <RecipeCard
                    key={item._id}
                    item={item}
                    onToggleFavorite={handleToggleFavorite}
                    onClickRecipeCard={onClickRecipeCard}
                    onDelete={() => handleDelete(item._id as string)}
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
      )}
    </>
  );
};

export default Favorites;
