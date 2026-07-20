import { CATEGORIES, DIFFICULTIES } from "@/lib/utilities/constatnts";
import { PanelFilterState } from "@/types/filter";
import { FilterCheckboxGroup } from "./FilterCheckboxGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterSlider } from "./FilterSlider";
import { RecipeSort } from "./RecipeSort";

interface FilterBodyProps {
  filters: PanelFilterState;
  onChange: (filters: PanelFilterState) => void;
}

export const FilterBody = ({ filters, onChange }: FilterBodyProps) => (
  <div className="flex flex-col gap-6 py-4">
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="flex flex-col gap-2 md:gap-3">
        <p className="text-sm font-semibold text-primary tracking-widest uppercase">
          Category
        </p>
        {CATEGORIES.map((item) => (
          <div key={item} className="flex flex-col gap-2">
            <div className="flex gap-4">
              <Checkbox
                id={`cat-${item}`}
                checked={filters.categories.includes(item)}
                onCheckedChange={() => {
                  let newCategories = filters.categories;
                  if (newCategories.includes(item)) {
                    newCategories = newCategories.filter((i) => i !== item);
                  } else {
                    newCategories = [...newCategories, item];
                  }
                  
                  if (newCategories.includes("All") && !filters.categories.includes("All")) {
                    newCategories = ["All"];
                  } else if (newCategories.includes("All") && newCategories.length > 1) {
                    newCategories = newCategories.filter((c) => c !== "All");
                  }
                  
                  // Reset subcategories if parent is unchecked
                  let newMainSubs = filters.mainCourseSubCategories || [];
                  let newSidesSubs = filters.sidesSubCategories || [];
                  if (item === "Main Course" && !newCategories.includes("Main Course")) {
                    newMainSubs = [];
                  }
                  if (item === "Sides" && !newCategories.includes("Sides")) {
                    newSidesSubs = [];
                  }

                  onChange({ 
                    ...filters, 
                    categories: newCategories, 
                    mainCourseSubCategories: newMainSubs, 
                    sidesSubCategories: newSidesSubs 
                  });
                }}
                className="h-5 w-5 border-[1px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor={`cat-${item}`} className="text-sm cursor-pointer">
                {item}
              </label>
            </div>
            
            {/* Subcategories */}
            {item === "Main Course" && filters.categories.includes("Main Course") && (
              <div className="flex flex-col gap-2 ml-9">
                {[
                  { label: "Tambuli", value: "Tambuli" },
                  { label: "Sasive", value: "Sasive" },
                  { label: "Majjige Huli", value: "Majjige Huli" },
                  { label: "Hasi", value: "Hasi" },
                  { label: "Sambar", value: "Sambar" },
                  { label: "Saaru", value: "Saaru" },
                  { label: "Other", value: "Main Course:Other" },
                ].map(subItem => (
                  <div key={subItem.value} className="flex gap-4">
                    <Checkbox
                      id={`subcat-${subItem.value}`}
                      checked={(filters.mainCourseSubCategories || []).includes(subItem.value)}
                      onCheckedChange={() => {
                        const currentSubs = filters.mainCourseSubCategories || [];
                        const newSubs = currentSubs.includes(subItem.value)
                          ? currentSubs.filter((i) => i !== subItem.value)
                          : [...currentSubs, subItem.value];
                        onChange({ ...filters, mainCourseSubCategories: newSubs });
                      }}
                      className="h-5 w-5 border-[1px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label htmlFor={`subcat-${subItem.value}`} className="text-sm cursor-pointer">
                      {subItem.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
            
            {item === "Sides" && filters.categories.includes("Sides") && (
              <div className="flex flex-col gap-2 ml-9">
                {[
                  { label: "Chatni", value: "Chatni" },
                  { label: "Palya", value: "Palya" },
                  { label: "Kosambari", value: "Kosambari" },
                  { label: "Other", value: "Sides:Other" },
                ].map(subItem => (
                  <div key={subItem.value} className="flex gap-4">
                    <Checkbox
                      id={`subcat-${subItem.value}`}
                      checked={(filters.sidesSubCategories || []).includes(subItem.value)}
                      onCheckedChange={() => {
                        const currentSubs = filters.sidesSubCategories || [];
                        const newSubs = currentSubs.includes(subItem.value)
                          ? currentSubs.filter((i) => i !== subItem.value)
                          : [...currentSubs, subItem.value];
                        onChange({ ...filters, sidesSubCategories: newSubs });
                      }}
                      className="h-5 w-5 border-[1px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label htmlFor={`subcat-${subItem.value}`} className="text-sm cursor-pointer">
                      {subItem.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
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
