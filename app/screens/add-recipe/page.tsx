"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RecipeForm, { RecipeFormData } from "@/components/recipe/RecipeForm";
import { useGlobalContext } from "@/context";
import { PageOverlay } from "@/components/loading/PageOverlay";

const AddRecipe = () => {
  const router = useRouter();
  const { setAllRecipes } = useGlobalContext();
  const [buttonloading, setButtonLoading] = useState(false);

  const handleSubmit = async (data: RecipeFormData, totalMinutes: number) => {
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          difficulty: data.difficulty,
          timeNeeded: totalMinutes,
          servings: Number(data.servings),
          ingredients: data.ingredients,
          instructions: data.instructions,
          image: data.image,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Recipe added successfully!");
      setAllRecipes([]); // clear cache so discover page refetches
      router.push("/screens/discover");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <>
      <PageOverlay show={buttonloading} />
      <RecipeForm
        onSubmit={handleSubmit}
        buttonLoading={buttonloading}
        pageTitle="Add New Recipe"
        submitLabel="Submit"
        onBeforeSubmit={() => setButtonLoading(true)}
        onValidationFailed={() => setButtonLoading(false)}
      />
    </>
  );
};

export default AddRecipe;
