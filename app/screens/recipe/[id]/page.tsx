"use client";
import { use, useState } from "react";
import { RecipeItem } from "@/types";
import { RecipeBadges } from "@/components/recipe/RecipeBadges";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeInstructions } from "@/components/recipe/RecipeInstructions";
import { discoverMockData } from "@/mockData/data";
import { RecipeImage } from "@/components/recipe/RecipeImage";
import { useRecipes } from "@/hooks/useRecipes";
import { useSession } from "next-auth/react";
import RecipeActions from "@/components/recipe/RecipeActions";
import { useIsOwner } from "@/hooks/useIsOwner";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();

  const { allRecipes, handleToggleFavorite, loading } = useRecipes();
  const recipe = allRecipes.find((r) => r.id === id);
  const [favorite, setFavorite] = useState(recipe?.isFavorite ?? false);
  const isFavorited = allRecipes.find((r) => r.id === id)?.isFavorite ?? false;

  if (!recipe) return <p className="text-center py-12">Recipe not found</p>;

  const isOwner = useIsOwner(recipe);

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
              recipeId={recipe.id}
              onToggleFavorite={handleToggleFavorite}
            />

            <div className="px-4 md:px-0 py-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
                    {recipe.title}
                  </h1>
                  <RecipeActions
                    recipeId={recipe.id}
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
