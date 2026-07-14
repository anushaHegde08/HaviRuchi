export interface RecipeItem {
  id: string;
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  timeNeeded: number;
  difficulty: string;
  servings: number;
  isFavorite: boolean;
  status?: "pending" | "approved" | "rejected";
  reviewNote?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string | Date;
}

export interface AddField {
  id: number;
  value: string;
  measurement?: string;
}

export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string;
}

export interface RecipeDetail extends RecipeItem {
  ingredients: Ingredient[];
  instructions: string[];
}
