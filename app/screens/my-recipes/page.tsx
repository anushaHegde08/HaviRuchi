"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/discover/RecipeCard";
import { Typography } from "@/components/ui/typography";
import { RecipeItem } from "@/types";
import { ITEMS_PER_PAGE, MOBILE_LOAD_COUNT } from "@/mockData/constatnts";
import { totalPages } from "@/lib/utilities/helperFunction";
import PaginationComponent from "@/components/discover/PaginationComponent";
import { useRecipes } from "@/hooks/useRecipes";
import { NoItemsFound } from "@/components/empty-state/NoItemsFound";
import { BookOpen } from "lucide-react";
import { RecipeGridSkeleton } from "@/components/loading/RecipeCardSkeleton";

const MyRecipes = () => {
  const router = useRouter();
  const { handleToggleFavorite } = useRecipes();

  const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_LOAD_COUNT);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await fetch("/api/recipes/my-recipes", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          console.error(data.error);
          return;
        }

        const mapped: RecipeItem[] = data.map((r: any) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          image: r.image || "",
          category: r.category,
          difficulty: r.difficulty,
          timeNeeded: r.timeNeeded,
          servings: r.servings,
          ingredients: r.ingredients,
          instructions: r.instructions,
          isFavorite: r.isFavorite,
          createdBy: r.createdBy,
        }));

        setMyRecipes(mapped);
      } catch (error) {
        console.error("Failed to fetch my recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  // desktop pagination
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = myRecipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // mobile infinite scroll
  const mobileItems = myRecipes.slice(0, mobileVisibleCount);

  const handleDelete = (id: string) => {
    setMyRecipes((prev) => prev.filter((r) => r.id !== id)); // ← remove instantly
  };

  // if (loading)
  //   return (
  //     <p className="text-center py-12 text-muted-foreground">Loading...</p>
  //   );

  return (
    <>
      {loading ? (
        <RecipeGridSkeleton count={ITEMS_PER_PAGE} />
      ) : (
        <div className="flex flex-col gap-4 px-6 py-4">
          <Typography
            variant="h3"
            color="primary"
            weight="semibold"
            className="text-start"
          >
            My Recipes
          </Typography>
          <Typography variant="body" color="text" className="italic text-start">
            You have added {myRecipes.length} recipes
          </Typography>

          {myRecipes.length === 0 && !loading ? (
            <NoItemsFound
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="No recipes added yet"
              description="Share your favorite Havyaka recipes with the community"
              actionLabel="Add Recipe"
              actionHref="/screens/add-recipe"
            />
          ) : (
            <>
              {/* Mobile grid */}
              <div className="grid grid-cols-1 gap-6 md:hidden">
                {mobileItems.map((item: RecipeItem) => (
                  <RecipeCard
                    key={item.id}
                    item={item}
                    onToggleFavorite={handleToggleFavorite}
                    onClickRecipeCard={(id) =>
                      router.push("/screens/recipe/" + id)
                    }
                    onDelete={() => handleDelete(item.id as string)}
                  />
                ))}
              </div>

              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-2 gap-6">
                {itemsToRender.map((item: RecipeItem) => (
                  <RecipeCard
                    key={item.id}
                    item={item}
                    onToggleFavorite={handleToggleFavorite}
                    onClickRecipeCard={(id) =>
                      router.push("/screens/recipe/" + id)
                    }
                    onDelete={() => handleDelete(item.id as string)}
                  />
                ))}
              </div>

              <PaginationComponent
                totalPages={totalPages(myRecipes, ITEMS_PER_PAGE)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                allFilteredRecipes={myRecipes}
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

export default MyRecipes;
