export interface FilterState {
  categories: string[];
  difficulties: string[];
  maxTime: number;
}

export const defaultFilters: FilterState = {
  categories: [],
  difficulties: [],
  maxTime: 75,
};
