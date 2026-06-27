"use client";
import PaginationComponent from "@/components/discover/PaginationComponent";
import RecipeCard from "@/components/discover/RecipeCard";
import { NoItemsFound } from "@/components/empty-state/NoItemsFound";
import { APIErrors } from "@/components/error-screens/APIErrors";
import { RecipeGridSkeleton } from "@/components/loading/RecipeCardSkeleton";
import { Typography } from "@/components/ui/typography";
import { useRecipes } from "@/hooks/useRecipes";
import { totalPages } from "@/lib/utilities/helperFunction";
import { ITEMS_PER_PAGE, MOBILE_LOAD_COUNT } from "@/mockData/constatnts";
import { RecipeItem } from "@/types";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MyRecipes = () => {
  const router = useRouter();
  const { handleToggleFavorite } = useRecipes();

  const onToggleFavorite = (id: string) => {
    handleToggleFavorite(id);
    setMyRecipes((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isFavorite: !r.isFavorite } : r)),
    );
  };

  const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_LOAD_COUNT);
  const initialized = useRef(false);

  const fetchMyRecipes = async (isRetry = false) => {
    if (isRetry) {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/recipes/my-recipes", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load");
        console.error(data.error);
        return;
      }

      const mapped: RecipeItem[] = data.map((r: RecipeItem) => ({
        id: r._id,
        _id: r._id,
        title: r.title,
        description: r.description,
        image: r.image || "",
        category: r.category,
        difficulty: r.difficulty,
        timeNeeded: r.timeNeeded,
        servings: r.servings,
        isFavorite: r.isFavorite,
        createdBy: r.createdBy,
      }));

      setMyRecipes(mapped);
      setError(null);
    } catch (error) {
      setError("Something went wrong");
      console.error("Failed to fetch my recipes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void fetchMyRecipes();
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
    setMyRecipes((prev) => prev.filter((r) => r._id !== id)); // ← remove instantly
  };

  // if (loading)
  //   return (
  //     <p className="text-center py-12 text-muted-foreground">Loading...</p>
  //   );

  return (
    <>
      {error ? (
        <APIErrors onRetry={() => void fetchMyRecipes(true)} className="min-h-[400px] md:min-h-[400px]" />
      ) : loading ? (
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
              className="min-h-[400px] md:min-h-[400px]"
            />
          ) : (
            <>
              {/* Mobile grid */}
              <div className="grid grid-cols-1 gap-6 md:hidden">
                {mobileItems.map((item: RecipeItem) => (
                  <RecipeCard
                    key={item._id}
                    item={item}
                    onToggleFavorite={onToggleFavorite}
                    onClickRecipeCard={(id) =>
                      router.push("/screens/recipe/" + id)
                    }
                    onDelete={() => handleDelete(item._id as string)}
                  />
                ))}
              </div>

              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-2 gap-6">
                {itemsToRender.map((item: RecipeItem) => (
                  <RecipeCard
                    key={item._id}
                    item={item}
                    onToggleFavorite={onToggleFavorite}
                    onClickRecipeCard={(id) =>
                      router.push("/screens/recipe/" + id)
                    }
                    onDelete={() => handleDelete(item._id as string)}
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
