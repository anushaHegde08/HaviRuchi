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
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface AddField {
  id: number;
  value: string;
  measurement?: string;
}

export interface RecipeDetail extends RecipeItem {
  ingredients: string[];
  instructions: string[];
}
