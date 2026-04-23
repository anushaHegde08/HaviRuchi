"use client";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";

export const useRecipes = () => {
  const router = useRouter();
  const { allRecipes, toggleFavorite } = useGlobalContext();

  const favoriteRecipes = allRecipes.filter((r) => r.isFavorite);

  const onClickRecipeCard = (id: number) => {
    router.push("/screens/recipe/" + id);
  };

  return {
    allRecipes,
    favoriteRecipes,
    toggleFavorite,
    onClickRecipeCard,
  };
};
