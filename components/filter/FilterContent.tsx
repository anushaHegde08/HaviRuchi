import { useGlobalContext } from "@/context";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { FilterIcon } from "lucide-react";
import { CATEGORIES, DIFFICULTIES, TIME_LABELS } from "@/mockData/constatnts";

// const DRAWER_SIDES = ["top", "right", "bottom", "left"] as const;

const FilterContent = () => {
  const { filterOpen, setFilterOpen } = useGlobalContext();
  const [cookTime, setCookTime] = React.useState([0]);
  // const isMobile = useIsMobile();
  // if (!filterOpen) return null;
  return (
    <>
      {/* {filterOpen && (
        <div
          className="fixed inset-0 bg-white/40 backdrop-blur-sm z-40"
          onClick={() => setFilterOpen(false)}
        ></div>
      )} */}
      <div className="flex flex-wrap gap-2">
        {/* {DRAWER_SIDES.map((side) => ( */}
        <Drawer
          direction={true ? "right" : "top"}
          // key={side}
          // direction={"top"}
        >
          <DrawerTrigger asChild>
            <Button
              onClick={() => setFilterOpen(!filterOpen)}
              variant="ghost"
              className="flex gap-[1px] hover:bg-transparent hover:text-primary p-0 text-sm"
            >
              <FilterIcon />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="pt-0">
              <DrawerTitle className="text-primary pb-2">
                Filter Recipes
              </DrawerTitle>
              <FieldSet className="flex-row items-start gap-4">
                <FieldGroup className="gap-3">
                  <FieldLabel className="text-primary text-sm font-semibold">
                    CATEGORIES
                  </FieldLabel>
                  {CATEGORIES.map((category) => (
                    <Field
                      orientation="horizontal"
                      className="gap-2"
                      key={category}
                    >
                      <Checkbox
                        id={category}
                        name={category}
                        className={`rounded-[6px]`}
                      />
                      <FieldLabel htmlFor={category}>{category}</FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                <FieldGroup className="gap-3">
                  <FieldLabel className="text-primary text-sm font-semibold">
                    DIFFICULTY
                  </FieldLabel>
                  {DIFFICULTIES.map((level) => (
                    <Field
                      orientation="horizontal"
                      className="gap-2"
                      key={level}
                    >
                      <Checkbox
                        id={level}
                        name={level}
                        className={`rounded-[6px]`}
                      />
                      <FieldLabel htmlFor={level}>{level}</FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel className="text-primary text-sm font-semibold">
                    TIME TO COOK
                  </FieldLabel>
                  <div className="mx-auto grid w-full max-w-xs gap-3">
                    <Slider
                      id="slider"
                      value={cookTime}
                      onValueChange={setCookTime}
                      min={0}
                      max={60}
                      step={5}
                    />
                    <div className="flex justify-between w-full">
                      {TIME_LABELS.map((label) => (
                        <span
                          key={label}
                          className={`text-sm ${
                            TIME_LABELS[cookTime[0]] === label
                              ? "text-primary font-bold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* <Slider defaultValue={[0]} max={100} step={1} /> */}
                </FieldGroup>
              </FieldSet>
            </DrawerHeader>
            <DrawerFooter className="flex flex-row justify-end gap-4">
              <DrawerClose asChild>
                <Button variant="outline">Clear Filters</Button>
              </DrawerClose>
              <Button>Apply Filters</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {/* ))} */}
      </div>
    </>
  );
};

export default FilterContent;
