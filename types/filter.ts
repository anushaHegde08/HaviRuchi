export type SortOption = 
  | "newest" 
  | "oldest" 
  | "time_asc" 
  | "time_desc" 
  | "difficulty_asc" 
  | "difficulty_desc" 
  | "alpha_asc" 
  | "alpha_desc";

export interface BadgeFilterState {
  category: string;
  subCategory: string;
}

export interface PanelFilterState {
  categories: string[];
  mainCourseSubCategories: string[];
  sidesSubCategories: string[];
  difficulties: string[];
  maxTime: number;
  sortBy: SortOption;
}

export type FilterMode = "badge" | "panel" | "none";

export const defaultBadgeFilters: BadgeFilterState = {
  category: "All",
  subCategory: "All",
};

export const defaultPanelFilters: PanelFilterState = {
  categories: [],
  mainCourseSubCategories: [],
  sidesSubCategories: [],
  difficulties: [],
  maxTime: 120,
  sortBy: "newest",
};
