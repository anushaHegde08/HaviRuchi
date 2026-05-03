import { useSession } from "next-auth/react";
import { RecipeItem } from "@/types";

export const useIsOwner = (recipe: RecipeItem) => {
  const { data: session } = useSession();

  if (!session?.user?.id || !recipe?.createdBy) return false;

  return (
    session.user.id === recipe.createdBy._id ||
    session.user.email === recipe.createdBy.email
  );
};
