"use client";
import { useGlobalContext } from "@/context";
import { useSession } from "next-auth/react";
import { getRecipeImage } from "@/lib/utilities/categoryImages";
import { RecipeItem } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useRecipes = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    allRecipes,
    setAllRecipes,
    toggleFavorite,
    recipesFetched,
    setRecipesFetched,
    favoritesFetched,
    setFavoritesFetched,
    panelFilters,
  } = useGlobalContext();
  const [loading, setLoading] = useState(!recipesFetched);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);

      const shouldFetchRecipes = !recipesFetched;
      const shouldFetchFavorites = !!session && !favoritesFetched;

      const [recipesResult, favoritesResult] = await Promise.allSettled([
        shouldFetchRecipes
          ? fetch("/api/recipes", { cache: "no-store" })
          : Promise.resolve(null),
        shouldFetchFavorites
          ? fetch("/api/users/favorites", { cache: "no-store" })
          : Promise.resolve(null),
      ]);

      let nextRecipes = allRecipes;

      if (shouldFetchRecipes) {
        if (recipesResult.status === "rejected" || !recipesResult.value?.ok) {
          setError("Failed to load recipes. Try again.");
          return;
        }

        let recipesData: RecipeItem[];
        try {
          recipesData = await recipesResult.value.json();
        } catch {
          setError("Failed to load recipes. Try again.");
          return;
        }

        if (!Array.isArray(recipesData)) {
          setError("Failed to load recipes. Try again.");
          return;
        }

        const existingFavoriteIds = allRecipes
          .filter(r => r.isFavorite)
          .map(r => r._id);

        nextRecipes = recipesData.map((r: RecipeItem) => ({
          ...r,
          id: r._id,
          _id: r._id,
          image: getRecipeImage(r.image, r.category),
          isFavorite: existingFavoriteIds.includes(r._id),
        }));

        if (shouldFetchFavorites) {
          const favoriteRecipeIds =
            favoritesResult.status === "fulfilled" &&
            favoritesResult.value !== null &&
            favoritesResult.value?.ok
              ? await (async () => {
                  try {
                    return (await favoritesResult.value!.json()) as string[];
                  } catch {
                    return [] as string[];
                  }
                })()
              : [];

          const favoriteIds = Array.isArray(favoriteRecipeIds)
            ? favoriteRecipeIds.map((id: string) => id)
            : [];

          nextRecipes = nextRecipes.map((recipe) => ({
            ...recipe,
            isFavorite: favoriteIds.includes(recipe._id),
          }));

          setFavoritesFetched(true);
        }

        setAllRecipes(nextRecipes);
        setRecipesFetched(true);
        setError(null);
      } else if (shouldFetchFavorites) {
        if (
          favoritesResult.status === "rejected" ||
          favoritesResult.value === null ||
          !favoritesResult.value?.ok
        ) {
          setError("Failed to load favorites. Try again.");
          return;
        }

        const favoriteRecipeIds = await (async () => {
          try {
            return (await favoritesResult.value!.json()) as string[];
          } catch {
            return [] as string[];
          }
        })();

        const favoriteIds = Array.isArray(favoriteRecipeIds)
          ? favoriteRecipeIds.map((id: string) => id)
          : [];

        setAllRecipes((prev) =>
          prev.map((recipe) => ({
            ...recipe,
            isFavorite: favoriteIds.includes(recipe._id),
          })),
        );
        setFavoritesFetched(true);
        setError(null);
      }
    } catch (error) {
      setError("Failed to load recipes. Try again.");
      console.error("UseRecipe Hook failed to fetch with", error);
    } finally {
      setLoading(false);
    }
  }, [
    allRecipes,
    favoritesFetched,
    recipesFetched,
    setAllRecipes,
    setFavoritesFetched,
    setRecipesFetched,
    session,
  ]);

  const recipesFetchStarted = useRef(false);

  useEffect(() => {
    if (recipesFetched && favoritesFetched) return;
    if (recipesFetchStarted.current) return;
    recipesFetchStarted.current = true;

    const timeoutId = window.setTimeout(() => {
      void fetchRecipes();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      recipesFetchStarted.current = false;
    };
  }, [fetchRecipes, recipesFetched, favoritesFetched]);

  const sortRecipes = useCallback((recipes: RecipeItem[]) => {
    const sortBy = panelFilters?.sortBy || "newest";
    return [...recipes].sort((a, b) => {
      switch (sortBy) {
        case "newest": return b._id.localeCompare(a._id);
        case "oldest": return a._id.localeCompare(b._id);
        case "time_asc": return a.timeNeeded - b.timeNeeded;
        case "time_desc": return b.timeNeeded - a.timeNeeded;
        case "difficulty_asc": {
          const diff: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
          return (diff[a.difficulty] || 0) - (diff[b.difficulty] || 0);
        }
        case "difficulty_desc": {
          const diff: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
          return (diff[b.difficulty] || 0) - (diff[a.difficulty] || 0);
        }
        case "alpha_asc": return a.title.localeCompare(b.title);
        case "alpha_desc": return b.title.localeCompare(a.title);
        default: return 0;
      }
    });
  }, [panelFilters?.sortBy]);

  const sortedAllRecipes = sortRecipes(allRecipes);
  const favoriteRecipes = sortRecipes(allRecipes.filter((r) => r.isFavorite));

  // toggle favorite — updates DB and local state
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      if (!session) {
        toast.error("Please sign in to save favorites");
        router.push("/screens/sign-in");
        return;
      }

      const recipe = allRecipes.find((r) => r._id === id || r.id === id);
      const wasFavorited = recipe?.isFavorite ?? false;

      // optimistic update — update UI immediately
      toggleFavorite(id);

      try {
        const response = await fetch("/api/users/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: id }),
        });

        if (response.status === 404) {
          toggleFavorite(id);
          setAllRecipes((prev) =>
            prev.filter((r) => r._id !== id && r.id !== id),
          );
          toast.error("This recipe no longer exists", {
            position: "top-right",
          });
          return;
        }

        if (!response.ok) throw new Error("Failed to toggle favorite");
        if (wasFavorited) {
          toast.success("Recipe removed from favorites", {
            position: "top-right",
          });
        } else {
          toast.success("Recipe added to favorites", {
            position: "top-right",
          });
        }
      } catch (error) {
        toggleFavorite(id);
        toast.error("Failed to toggle favorite", {
          position: "top-right",
        });
        console.error("Failed to toggle favorite with", error);
      }
    },
    [allRecipes, toggleFavorite, setAllRecipes, session, router],
  );

  const onClickRecipeCard = useCallback(
    (id: string) => {
      router.push("/screens/recipe/" + id);
    },
    [router],
  );

  return {
    allRecipes: sortedAllRecipes,
    setAllRecipes,
    favoriteRecipes,
    handleToggleFavorite,
    onClickRecipeCard,
    loading,
    setLoading,
    error,
    retryFetch: fetchRecipes,
    sortRecipes,
  };
};
