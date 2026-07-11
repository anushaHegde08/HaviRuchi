export type SortOption = 
  | "newest" 
  | "oldest" 
  | "time_asc" 
  | "time_desc" 
  | "difficulty_asc" 
  | "difficulty_desc" 
  | "alpha_asc" 
  | "alpha_desc";

export interface FilterState {
  categories: string[];
  difficulties: string[];
  maxTime: number;
  sortBy: SortOption;
}

export const defaultFilters: FilterState = {
  categories: [],
  difficulties: [],
  maxTime: 120,
  sortBy: "newest",
};
