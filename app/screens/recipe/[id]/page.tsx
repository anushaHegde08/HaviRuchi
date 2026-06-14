"use client";
import { APIErrors } from "@/components/error-screens/APIErrors";
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
import { use, useEffect, useRef, useState } from "react";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  useSession();

  const { recipeDetails, cacheRecipeDetail, allRecipes } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  const { handleToggleFavorite } = useRecipes();
  const initialized = useRef(false);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipeDetail = async (skipCache = false) => {
    if (!skipCache) {
      const cached = recipeDetails[id];
      if (cached) {
        setRecipe(cached);
        setLoading(false);
        return;
      }
    }

    if (skipCache) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load");
        return;
      }

      const mapped: RecipeDetail = {
        id: data._id,
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
          allRecipes.find((r) => r._id === data._id || r.id === data._id)
            ?.isFavorite ?? data.isFavorite,
        createdBy: data.createdBy,
      };
      cacheRecipeDetail(id, mapped);
      setRecipe(mapped);
    } catch (error) {
      setError("Something went wrong");
      console.error("Failed to fetch recipe", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void fetchRecipeDetail();
  }, []);

  const isOwner = useIsOwner(
    recipe ?? allRecipes.find((r) => r._id === id || r.id === id),
  );

  const isFavorited =
    allRecipes.find((r) => r._id === id || r.id === id)?.isFavorite ?? false;

  return (
    <>
      {error ? (
        <APIErrors
          message="Failed to load recipes. Try again."
          onRetry={() => void fetchRecipeDetail(true)}
        />
      ) : loading ? (
        <LoadingScreen />
      ) : recipe ? (
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
      ) : (
        <p className="text-center py-12">Recipe not found</p>
      )}
    </>
  );
}
