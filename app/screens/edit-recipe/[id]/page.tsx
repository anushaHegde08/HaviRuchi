"use client";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { PageOverlay } from "@/components/loading/PageOverlay";
import RecipeForm, { RecipeFormData } from "@/components/recipe/RecipeForm";
import { IngredientFieldProps } from "@/components/add-recipes/IngredientFields";
import { useGlobalContext } from "@/context";
import { AddField } from "@/types";
import { Ingredient } from "@/types/recipe";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { setRecipesFetched, invalidateRecipeDetail } = useGlobalContext();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState<RecipeFormData | undefined>(
    undefined,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error("Recipe not found");
          router.push("/screens/my-recipes");
          return;
        }

        // parse ingredients back to IngredientFieldProps
        const ingredients: IngredientFieldProps[] = data.ingredients.map(
          (ing: Ingredient, index: number) => {
            const isStandardUnit = ["cup", "tbsp", "tsp", "g", "kg", "ml", "l", "piece", "whole", "pinch", "sprig", "clove", "leaf", "handful", "inch", "to taste"].includes(ing.unit);
            return {
              id: index + 1,
              name: ing.name,
              quantity: ing.quantity,
              unit: isStandardUnit ? ing.unit : "Other",
              customUnit: isStandardUnit ? undefined : ing.unit,
            };
          }
        );

        const instructions: AddField[] = data.instructions.map(
          (inst: string, index: number) => ({
            id: index + 1,
            value: inst,
          }),
        );

        setInitialData({
          title: data.title,
          description: data.description,
          category: data.category,
          subCategory: data.subCategory,
          hours: Math.floor(data.timeNeeded / 60),
          minutes: data.timeNeeded % 60 || 10,
          servings: data.servings,
          ingredients,
          instructions,
          image: data.image || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load recipe");
      } finally {
        setFetching(false);
      }
    };

    void fetchRecipe();
  }, [id, router]);

  const handleSubmit = async (data: RecipeFormData, totalMinutes: number) => {
    try {
      setButtonLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { servings, hours: _hours, minutes: _minutes, ...rest } = data;
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          ingredients: data.ingredients.map(i => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit === "Other" && i.customUnit ? i.customUnit : i.unit,
          })),
          timeNeeded: totalMinutes,
          servings: Number(servings),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Recipe updated successfully!");
      invalidateRecipeDetail(id as string);
      setRecipesFetched(false);
      router.back();
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <>
      {fetching ? (
        <LoadingScreen />
      ) : (
        <>
          <PageOverlay show={buttonLoading} />
          <RecipeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            buttonLoading={buttonLoading}
            pageTitle="Edit Recipe"
            submitLabel="Update Recipe"
            onFormChange={() => setHasChanges(true)}
            submitDisabled={!hasChanges}
          />
        </>
      )}
    </>
  );
}
