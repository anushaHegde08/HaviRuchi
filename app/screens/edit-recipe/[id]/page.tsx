"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RecipeForm, { RecipeFormData } from "@/components/recipe/RecipeForm";
import { AddField } from "@/types";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState<RecipeFormData | undefined>(
    undefined,
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error("Recipe not found");
          router.push("/screens/my-recipes");
          return;
        }

        // parse ingredients back to AddField
        const ingredients: AddField[] = data.ingredients.map(
          (ing: string, index: number) => {
            const parts = ing.split(" - ");
            return {
              id: index + 1,
              value: parts[0] || ing,
              measurement: parts[1] || "",
            };
          },
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
          difficulty: data.difficulty,
          hours: Math.floor(data.timeNeeded / 60),
          minutes: data.timeNeeded % 60 || 10,
          servings: data.servings,
          ingredients,
          instructions,
          image: data.image || "",
        });
      } catch (error) {
        toast.error("Failed to load recipe");
      } finally {
        setFetching(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (data: RecipeFormData, totalMinutes: number) => {
    try {
      setButtonLoading(true);
      const { servings, ...rest } = data;
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          servings: Number(servings),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Recipe updated successfully!");
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
        <RecipeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          buttonLoading={buttonLoading}
          pageTitle="Edit Recipe"
          submitLabel="Update Recipe"
          onFormChange={() => setHasChanges(true)}
          submitDisabled={!hasChanges}
        />
      )}
    </>
  );
}
