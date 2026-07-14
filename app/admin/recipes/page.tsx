"use client";

import { NoItemsFound } from "@/components/empty-state/NoItemsFound";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { useGlobalContext } from "@/context";
import { RecipeItem } from "@/types";
import { ClipboardList } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminRecipesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setRecipesFetched, invalidateRecipeDetail, setPendingCount } = useGlobalContext();
  const [pendingRecipes, setPendingRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.role !== "admin") {
      router.push("/");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/admin/recipes?status=pending");
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        setPendingRecipes(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load pending recipes");
      } finally {
        setLoading(false);
      }
    })();
  }, [session, status, router]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "approved" | "rejected",
  ) => {
    const note = reviewNotes[id] || "";

    if (newStatus === "rejected" && !note.trim()) {
      toast.error("Review note is required for rejection");
      return;
    }

    try {
      const res = await fetch(`/api/admin/recipes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reviewNote: note }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Recipe ${newStatus} successfully`);

      // Update local state and global cache
      setPendingRecipes((prev) => prev.filter((r) => r._id !== id));
      invalidateRecipeDetail(id);
      setRecipesFetched(false);
      setPendingCount((prev) => Math.max(0, prev - 1));

      // Cleanup the note for this recipe
      setReviewNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[id];
        return newNotes;
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update recipe status");
    }
  };

  if (status === "loading" || loading) {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin")
    return null;

  return (
    <div className="container mx-auto px-6 py-8">
      <Typography variant="h2" color="primary" weight="bold" className="mb-6">
        Admin Dashboard: Pending Recipes
      </Typography>

      {pendingRecipes.length === 0 ? (
        <NoItemsFound
          icon={<ClipboardList className="w-12 h-12 text-primary" />}
          title="No recipes pending approval"
          description="You're all caught up! There are no new recipes waiting for review."
          actionLabel="Back to Home"
          actionHref="/"
        />
      ) : (
        <div className="grid gap-6">
          {pendingRecipes.map((recipe) => (
            <Card
              key={recipe._id}
              className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="bg-primary/[0.02] border-b p-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl text-primary font-bold break-words whitespace-normal line-clamp-2">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      By:{" "}
                      <span className="font-medium text-foreground/80">
                        {recipe.createdBy?.name}
                      </span>{" "}
                      ({recipe.createdBy?.email})
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                    Submitted:{" "}
                    {recipe.createdAt
                      ? new Date(recipe.createdAt).toLocaleString()
                      : "Date unknown"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Admin review note (required for rejection, optional for approval)..."
                  value={reviewNotes[recipe._id] || ""}
                  onChange={(e) =>
                    setReviewNotes((prev) => ({
                      ...prev,
                      [recipe._id]: e.target.value,
                    }))
                  }
                  className="min-h-[100px] resize-y"
                />
              </CardContent>
              <CardFooter className="p-5 bg-muted/10 border-t flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    window.open(`/screens/recipe/${recipe._id}`, "_blank")
                  }
                >
                  View Recipe
                </Button>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="destructive"
                    className="flex-1 sm:flex-none hover:bg-primary text-white"
                    onClick={() => handleUpdateStatus(recipe._id, "rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                    onClick={() => handleUpdateStatus(recipe._id, "approved")}
                  >
                    Approve
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
