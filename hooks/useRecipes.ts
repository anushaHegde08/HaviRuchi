"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";
import { RecipeItem } from "@/types";
import { toast } from "sonner";

export const useRecipes = () => {
  const router = useRouter();
  const { allRecipes, setAllRecipes, toggleFavorite } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // fetch recipes and favorites in parallel
        const [recipesRes, favoritesRes] = await Promise.all([
          fetch("/api/recipes", { cache: "no-store" }),
          fetch("/api/users/favorites", { cache: "no-store" }),
        ]);
        const recipesData = await recipesRes.json();
        const favoritesData = await favoritesRes.json();

        // get favorite IDs
        const favoriteIds = Array.isArray(favoritesData)
          ? favoritesData.map((f: any) => {
              return f._id || f;
            })
          : [];

        // if (!recipesRes.ok) {
        //   setError(recipesData.error);
        //   return;
        // }

        const mapped: RecipeItem[] = recipesData.map((r: any) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          image: r.image || "/images/placeholder.jpg",
          category: r.category,
          difficulty: r.difficulty,
          timeNeeded: r.timeNeeded,
          servings: r.servings,
          ingredients: r.ingredients,
          instructions: r.instructions,
          isFavorite: favoriteIds.includes(r._id),
          createdBy: r.createdBy,
        }));

        setAllRecipes(mapped);
      } catch (error) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (allRecipes.length > 0) return;
    fetchRecipes();
  }, []);

  const favoriteRecipes = allRecipes.filter((r) => r.isFavorite);

  // toggle favorite — updates DB and local state
  const handleToggleFavorite = async (id: string) => {
    const recipe = allRecipes.find((r) => r.id === id);
    const wasFavorited = recipe?.isFavorite ?? false;

    // optimistic update — update UI immediately
    toggleFavorite(id);

    try {
      await fetch("/api/users/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: id }),
      });
      wasFavorited
        ? toast.error("Recipe removed from favorites", {
            position: "top-right",
          })
        : toast.success("Recipe added to favorites", {
            position: "top-right",
          });
    } catch (error) {
      // revert if API call fails
      toggleFavorite(id);
      toast.error("Failed to toggle favorite", {
        position: "top-right",
      });
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
  };
};
