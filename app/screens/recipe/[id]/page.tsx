"use client";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import RecipeActions from "@/components/recipe/RecipeActions";
import { RecipeBadges } from "@/components/recipe/RecipeBadges";
import { RecipeImage } from "@/components/recipe/RecipeImage";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeInstructions } from "@/components/recipe/RecipeInstructions";
import { useGlobalContext } from "@/context";
import { useIsOwner } from "@/hooks/useIsOwner";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeDetail } from "@/types";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  useSession();

  const { recipeDetails, cacheRecipeDetail, allRecipes } = useGlobalContext();

  const { handleToggleFavorite, loading, setLoading } = useRecipes();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRecipe = async () => {
      const cached = recipeDetails[id];
      if (cached) {
        if (!cancelled) {
          setRecipe(cached);
          setLoading(false);
        }
        return;
      }

      try {
        if (!cancelled) setLoading(true);
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        if (!response.ok || cancelled) return;

        const mapped: RecipeDetail = {
          _id: data._id,
          title: data.title,
          description: data.description,
          image: data.image || "",
          category: data.category,
          difficulty: data.difficulty,
          timeNeeded: data.timeNeeded,
          servings: data.servings,
          ingredients: data.ingredients,
          instructions: data.instructions,
          isFavorite:
            allRecipes.find((r) => r._id === data._id)?.isFavorite ??
            data.isFavorite,
          createdBy: data.createdBy,
        };
        if (!cancelled) {
          cacheRecipeDetail(id, mapped);
          setRecipe(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch recipe", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRecipe();
    return () => {
      cancelled = true;
    };
  }, [allRecipes, cacheRecipeDetail, id, recipeDetails, setLoading]);

  const isOwner = useIsOwner(recipe ?? allRecipes.find((r) => r._id === id));

  const isFavorited = allRecipes.find((r) => r._id === id)?.isFavorite ?? false;

  if (!recipe) return <p className="text-center py-12">Recipe not found</p>;

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="min-h-screen bg-background px-6 mb-16 mt-2 md:mt-4">
          <div className="max-w-4xl mx-auto">
            <RecipeImage
              image={
                recipe.image && recipe.image !== ""
                  ? recipe.image
                  : "/images/placeholder.png"
              }
              title={recipe.title}
              favorite={isFavorited}
              recipeId={recipe._id}
              onToggleFavorite={handleToggleFavorite}
            />

            <div className="px-4 md:px-0 py-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
                    {recipe.title}
                  </h1>
                  <RecipeActions
                    recipeId={recipe._id}
                    isOwner={isOwner}
                    variant="detail"
                    className="flex-row"
                  />
                </div>
                <RecipeBadges recipe={recipe} />
              </div>
              <hr />
              <RecipeIngredients ingredients={recipe.ingredients} />
              <hr />
              <RecipeInstructions instructions={recipe.instructions} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
