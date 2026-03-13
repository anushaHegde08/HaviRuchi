export interface RecipeItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  timeNeeded: string;
  difficulty: string;
  servings: number;
  isFavorite: boolean;
}

export interface AddField {
  id: number;
  value: string;
}
