"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RecipeForm, { RecipeFormData } from "@/components/recipe/RecipeForm";
import { AddField } from "@/types";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState<RecipeFormData | undefined>(
    undefined,
  );

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
      setLoading(true);
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          image: data.image,
          category: data.category,
          difficulty: data.difficulty,
          timeNeeded: totalMinutes,
          servings: Number(data.servings),
          ingredients: data.ingredients,
          instructions: data.instructions,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Recipe updated successfully!");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <p className="text-center py-12 text-muted-foreground">Loading...</p>
    );

  return (
    <RecipeForm
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
      pageTitle="Edit Recipe"
      submitLabel="Update Recipe"
    />
  );
}
