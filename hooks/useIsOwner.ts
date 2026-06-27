import { useSession } from "next-auth/react";
import { RecipeItem } from "@/types";

export const useIsOwner = (recipe?: RecipeItem) => {
  const { data: session } = useSession();

  if (!recipe) return false;

  if (!session?.user?.id || !recipe?.createdBy) return false;

  if (typeof recipe.createdBy === "string") {
    return session.user.id === recipe.createdBy;
  }

  return (
    session.user.id === recipe.createdBy._id ||
    session.user.email === recipe.createdBy.email
  );
};
