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
        const response = await fetch("/api/recipes", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
          return;
        }

        const mapped: RecipeItem[] = data.map((r: any) => ({
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
          isFavorite: r.isFavorite,
          createdBy: r.createdBy,
        }));

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

  const onClickRecipeCard = (id: string) => {
    router.push("/screens/recipe/" + id);
  };

  return {
    allRecipes,
    favoriteRecipes,
    toggleFavorite,
    onClickRecipeCard,
    loading,
    error,
  };
};
