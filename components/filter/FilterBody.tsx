"use client";
import { CATEGORIES, DIFFICULTIES } from "@/lib/utilities/constatnts";
import { FilterState } from "@/types/filter";
import { FilterCheckboxGroup } from "./FilterCheckboxGroup";
import { FilterSlider } from "./FilterSlider";

interface FilterBodyProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export const FilterBody = ({ filters, onChange }: FilterBodyProps) => (
  <div className="flex flex-col md:flex-row justify-between gap-6 py-4">
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
      // className="md:flex-[1]"
    />
    <FilterCheckboxGroup
      title="Difficulty"
      items={DIFFICULTIES}
      selected={filters.difficulties}
      onChange={(difficulties) => onChange({ ...filters, difficulties })}
      // className="md:flex-[1]"
    />
    <FilterSlider
      value={filters.maxTime}
      onChange={(maxTime) => onChange({ ...filters, maxTime })}
      className="md:flex-[0.5]"
    />
  </div>
);
