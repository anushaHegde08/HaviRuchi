"use client";
import { use, useState } from "react";
import { RecipeItem } from "@/types";
import { RecipeBadges } from "@/components/recipe/RecipeBadges";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeInstructions } from "@/components/recipe/RecipeInstructions";
import { discoverMockData } from "@/mockData/data";
import { RecipeImage } from "@/components/recipe/RecipeImage";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  console.log("params id:", id);
  console.log("Number(id):", Number(id));
  console.log(
    "found:",
    discoverMockData.find((r) => r.id === Number(id)),
  );
  const recipe = discoverMockData.find((r) => r.id === Number(id));
  // const recipe: RecipeItem = discoverMockData[0];
  const [favorite, setFavorite] = useState(recipe?.isFavorite ?? false);
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="min-h-screen bg-background px-6 mb-16">
      <div className="max-w-4xl mx-auto">
        <RecipeImage
          image={recipe.image}
          title={recipe.title}
          favorite={favorite}
          onFavoriteToggle={() => setFavorite(!favorite)}
        />

        <div className="px-4 md:px-0 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {recipe.title}
            </h1>
            <RecipeBadges recipe={recipe} />
          </div>
          <hr />
          <RecipeIngredients ingredients={recipe.ingredients} />
          <hr />
          <RecipeInstructions instructions={recipe.instructions} />
        </div>
      </div>
    </div>
  );
}
