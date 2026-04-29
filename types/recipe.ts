export interface RecipeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  timeNeeded: number;
  difficulty: string;
  servings: number;
  isFavorite: boolean;
  ingredients: string[];
  instructions: string[];
}

export interface AddField {
  id: number;
  value: string;
  measurement?: string;
}
