export interface RecipeItem {
  id: number;
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
}
