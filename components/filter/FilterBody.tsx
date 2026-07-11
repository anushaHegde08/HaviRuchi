import { CATEGORIES, DIFFICULTIES } from "@/lib/utilities/constatnts";
import { FilterState } from "@/types/filter";
import { FilterCheckboxGroup } from "./FilterCheckboxGroup";
import { FilterSlider } from "./FilterSlider";
import { RecipeSort } from "./RecipeSort";

interface FilterBodyProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export const FilterBody = ({ filters, onChange }: FilterBodyProps) => (
  <div className="flex flex-col gap-6 py-4">
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <FilterCheckboxGroup
        title="Category"
        items={CATEGORIES}
        selected={filters.categories}
        onChange={(categories) => {
          let newCategories = categories;
          if (categories.includes("All") && !filters.categories.includes("All")) {
            newCategories = ["All"];
          } else if (categories.includes("All") && categories.length > 1) {
            newCategories = categories.filter((c) => c !== "All");
          }
          onChange({ ...filters, categories: newCategories });
        }}
      />
      <FilterCheckboxGroup
        title="Difficulty"
        items={DIFFICULTIES}
        selected={filters.difficulties}
        onChange={(difficulties) => onChange({ ...filters, difficulties })}
      />
      <FilterSlider
        value={filters.maxTime}
        onChange={(maxTime) => onChange({ ...filters, maxTime })}
        className="md:flex-[0.5]"
      />
    </div>
    
    <RecipeSort 
      value={filters.sortBy} 
      onChange={(value) => onChange({ ...filters, sortBy: value })} 
    />
  </div>
);
