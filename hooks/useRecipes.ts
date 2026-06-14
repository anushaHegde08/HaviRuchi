"use client";
import { useGlobalContext } from "@/context";
import { RecipeItem } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useRecipes = () => {
  const router = useRouter();
  const {
    allRecipes,
    setAllRecipes,
    toggleFavorite,
    recipesFetched,
    setRecipesFetched,
    favoritesFetched,
    setFavoritesFetched,
  } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const shouldFetchRecipes = !recipesFetched;
      const shouldFetchFavorites = !favoritesFetched;

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

        nextRecipes = recipesData.map((r: RecipeItem) => ({
          ...r,
          id: r._id,
          _id: r._id,
          image: r.image || "/images/placeholder.jpg",
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

  const favoriteRecipes = allRecipes.filter((r) => r.isFavorite);

  // toggle favorite — updates DB and local state
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      const recipe = allRecipes.find((r) => r._id === id || r.id === id);
      const wasFavorited = recipe?.isFavorite ?? false;

      // optimistic update — update UI immediately
      toggleFavorite(id);

      try {
        await fetch("/api/users/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: id }),
        });
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
    [allRecipes, toggleFavorite],
  );

  const onClickRecipeCard = useCallback(
    (id: string) => {
      router.push("/screens/recipe/" + id);
    },
    [router],
  );

  return {
    allRecipes,
    setAllRecipes,
    favoriteRecipes,
    handleToggleFavorite,
    onClickRecipeCard,
    loading,
    setLoading,
    error,
    retryFetch: fetchRecipes,
  };
};
