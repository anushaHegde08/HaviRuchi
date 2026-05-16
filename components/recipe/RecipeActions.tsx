"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface RecipeActionsProps {
  recipeId: string;
  isOwner: boolean;
  variant?: "detail" | "card";
  onDelete?: () => void;
  className?: string;
}

const RecipeActions = ({
  recipeId,
  isOwner,
  variant = "detail",
  onDelete,
  className = "flex-col",
}: RecipeActionsProps) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!isOwner) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Recipe deleted successfully");

      if (onDelete) {
        onDelete();
      } else {
        router.back();
      }
    } catch (error) {
      toast.error("Failed to delete recipe");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`flex items-center gap-1 md:gap-2 ${className}`}>
      {/* Edit button */}
      <Button
        variant="outline"
        size={variant === "card" ? "iconSmall" : "default"}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/screens/edit-recipe/${recipeId}`);
        }}
        className="h-auto w-auto p-1 gap-0 md:gap-1 border-primary text-primary hover:bg-primary/5 hover:scale-110 transition-transform"
      >
        <Pencil />
        {variant === "detail" && <span className="ml-1">Edit</span>}
      </Button>

      {/* Delete button with confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size={variant === "card" ? "iconSmall" : "default"}
            className="h-auto w-auto p-1 gap-0 md:gap-1 border-destructive text-destructive hover:bg-destructive/5 hover:scale-110 transition-transform"
          >
            <Trash2 />
            {variant === "detail" && <span>Delete</span>}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This recipe will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecipeActions;
