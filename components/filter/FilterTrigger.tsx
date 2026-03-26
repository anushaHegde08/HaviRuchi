"use client";
import { useCallback, useState } from "react";
import { FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterBody } from "./FilterBody";
import { FilterState } from "@/types/filter";

const defaultFilters: FilterState = {
  categories: [],
  difficulties: [],
  maxTime: 45,
};

enum DrawerMode {
  DESKTOP = "desktop",
  MOBILE = "mobile",
}

export const FilterTrigger = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const closeFilter = useCallback((mode: DrawerMode) => {}, []);

  const handleClear = () => setFilters(defaultFilters);

  return (
    <>
      <div className="block">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 hover:bg-transparent hover:text-primary p-0 text-sm"
            >
              <FilterIcon className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="data-[side=top]:max-h-[50vh]">
            <SheetHeader>
              <SheetTitle className="text-primary text-xl font-bold">
                Filter
              </SheetTitle>
            </SheetHeader>
            <FilterBody
              filters={filters}
              onChange={setFilters}
              // onApply={() => closeFilter(DrawerMode.DESKTOP)}
              // onClear={handleClear}
            />
            <SheetFooter>
              <div className="flex gap-3 pt-2">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-primary text-primary hover:bg-primary/5"
                  >
                    Clear Filters
                  </Button>
                </SheetClose>
                <Button className="flex-1 rounded-xl">Apply Filters</Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop only — Popover */}
      {/* <div className="hidden sm:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <TriggerButton />
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-6 overflow-y-auto max-h-[80vh]"
            align="start"
            sideOffset={8}
          >
            <div className="flex items-center justify-between pb-4">
              <p className="text-primary text-xl font-bold">Filter</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPopoverOpen(false)}
                className="hover:bg-transparent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterBody
              filters={filters}
              onChange={setFilters}
              onApply={() => closeFilter(DrawerMode.MOBILE)}
              onClear={handleClear}
            />
          </PopoverContent>
        </Popover>
      </div> */}
    </>
  );
};
