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

  const { handleToggleFavorite, loading, setLoading } = useRecipes();
  const fetchInFlightRef = useRef(false);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchRecipe = async () => {
      if (retryTrigger > 0) {
        setLoading(true);
        setError(null);
      }

      const cached = recipeDetails[id];
      if (cached) {
        if (!ignore) {
          setRecipe(cached);
          setLoading(false);
        }
        return;
      }

      if (fetchInFlightRef.current) return;
      fetchInFlightRef.current = true;

      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();

        if (ignore) return;

        if (!response.ok) {
          setError(data.error || "Failed to load");
          return;
        }

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
        if (!ignore) {
          cacheRecipeDetail(id, mapped);
          setRecipe(mapped);
        }
      } catch (error) {
        if (ignore) return;
        setError("Something went wrong");
        console.error("Failed to fetch recipe", error);
      } finally {
        fetchInFlightRef.current = false;
        if (!ignore) setLoading(false);
      }
    };

    fetchRecipe();

    return () => {
      ignore = true;
    };
  }, [
    allRecipes,
    cacheRecipeDetail,
    id,
    recipeDetails,
    setLoading,
    retryTrigger,
  ]);

  const isOwner = useIsOwner(recipe ?? allRecipes.find((r) => r._id === id));

  const isFavorited = allRecipes.find((r) => r._id === id)?.isFavorite ?? false;

  return (
    <>
      {error ? (
        <APIErrors
          message="Failed to load recipes. Try again."
          onRetry={() => setRetryTrigger((prev) => prev + 1)}
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
