"use client";
import { useGlobalContext } from "@/context";
import { RecipeItem } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useRecipes = () => {
  const router = useRouter();
  const { allRecipes, setAllRecipes, toggleFavorite } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [recipesResult, favoritesResult] = await Promise.allSettled([
        fetch("/api/recipes", { cache: "no-store" }),
        fetch("/api/users/favorites", { cache: "no-store" }),
      ]);

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

      const favoriteRecipeIds =
        favoritesResult.status === "fulfilled" && favoritesResult.value?.ok
          ? await (async () => {
              try {
                return (await favoritesResult.value.json()) as string[];
              } catch {
                return [] as string[];
              }
            })()
          : [];

      const favoriteIds = Array.isArray(favoriteRecipeIds)
        ? favoriteRecipeIds.map((id: string) => id)
        : [];

      const mapped: RecipeItem[] = recipesData.map((r: RecipeItem) => ({
        _id: r._id,
        title: r.title,
        description: r.description,
        image: r.image || "/images/placeholder.jpg",
        category: r.category,
        difficulty: r.difficulty,
        timeNeeded: r.timeNeeded,
        servings: r.servings,
        isFavorite: favoriteIds.includes(r._id),
        createdBy: r.createdBy,
      }));

      setAllRecipes(mapped);
    } catch (error) {
      setError("Failed to load recipes. Try again.");
      console.error("UseRecipe Hook failed to fetch with", error);
    } finally {
      setLoading(false);
    }
  }, [setAllRecipes]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchRecipes();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchRecipes]);

  const favoriteRecipes = allRecipes.filter((r) => r.isFavorite);

  // toggle favorite — updates DB and local state
  const handleToggleFavorite = async (id: string) => {
    const recipe = allRecipes.find((r) => r._id === id);
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
  };

  const onClickRecipeCard = (id: string) => {
    router.push("/screens/recipe/" + id);
  };

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
