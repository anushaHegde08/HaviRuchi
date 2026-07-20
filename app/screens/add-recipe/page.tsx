"use client";
import { PageOverlay } from "@/components/loading/PageOverlay";
import RecipeForm, { RecipeFormData } from "@/components/recipe/RecipeForm";
import { useGlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AddRecipe = () => {
  const router = useRouter();
  const { setRecipesFetched } = useGlobalContext();
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
          subCategory: data.subCategory,
          timeNeeded: totalMinutes,
          servings: Number(data.servings),
          ingredients: data.ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit === "Other" && i.customUnit ? i.customUnit : i.unit,
          })),
          instructions: data.instructions,
          image: data.image,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Recipe added successfully!");
      setRecipesFetched(false);
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
