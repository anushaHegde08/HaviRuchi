"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";
import { RecipeItem } from "@/types";

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
        console.log("recipesData:", recipesData.length);
        console.log("favoritesData:", favoritesData);
        console.log("favoritesData type:", typeof favoritesData);
        // get favorite IDs
        const favoriteIds = Array.isArray(favoritesData)
          ? favoritesData.map((f: any) => {
              console.log("favorite item:", f);
              return f._id || f;
            })
          : [];
        console.log("favoriteIds:", favoriteIds);

        // if (!recipesRes.ok) {
        //   setError(recipesData.error);
        //   return;
        // }

        const mapped: RecipeItem[] = recipesData.map((r: any) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          image: r.image || "/images/image1.jpg",
          category: r.category,
          difficulty: r.difficulty,
          timeNeeded: r.timeNeeded,
          servings: r.servings,
          ingredients: r.ingredients,
          instructions: r.instructions,
          isFavorite: favoriteIds.includes(r._id),
          createdBy: r.createdBy,
        }));
        console.log(
          "mapped with favorites:",
          mapped.map((r) => ({ id: r.id, isFavorite: r.isFavorite })),
        );

        setAllRecipes(mapped);
      } catch (error) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const favoriteRecipes = allRecipes.filter((r) => r.isFavorite);

  // toggle favorite — updates DB and local state
  const handleToggleFavorite = async (id: string) => {
    console.log("handleToggleFavorite called with id:", id);
    // optimistic update — update UI immediately
    toggleFavorite(id);

    try {
      const response = await fetch("/api/users/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: id }),
      });
      const data = await response.json();
      console.log("toggle response:", data);
    } catch (error) {
      // revert if API call fails
      toggleFavorite(id);
      console.error("Failed to toggle favorite");
    }
  };

  const onClickRecipeCard = (id: string) => {
    router.push("/screens/recipe/" + id);
  };

  return {
    allRecipes,
    favoriteRecipes,
    handleToggleFavorite,
    onClickRecipeCard,
    loading,
    error,
  };
};
