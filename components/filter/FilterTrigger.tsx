"use client";
import { useState } from "react";
import { FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterBody } from "./FilterBody";
import { FilterState } from "@/types/filter";

const defaultFilters: FilterState = {
  categories: [],
  difficulties: [],
  maxTime: 45,
};

export const FilterTrigger = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // separate open states — critical fix
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleApply = (closeFn: () => void) => {
    console.log("Applied:", filters);
    closeFn();
  };

  const handleClear = () => setFilters(defaultFilters);

  const triggerButton = (
    <Button
      variant="ghost"
      className="flex items-center gap-1 hover:bg-transparent hover:text-primary p-0 text-sm"
    >
      <FilterIcon className="h-4 w-4" /> Filters
    </Button>
  );

  return (
    <>
      {/* Mobile only — Sheet from right */}
      <div className="block md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>{triggerButton}</SheetTrigger>
          <SheetContent side="right" className="w-[85vw] overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-primary text-xl font-bold">
                Filter
              </SheetTitle>
            </SheetHeader>
            <FilterBody
              filters={filters}
              onChange={setFilters}
              onApply={() => handleApply(() => setSheetOpen(false))}
              onClear={handleClear}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop only — Popover */}
      <div className="hidden md:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
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
              onApply={() => handleApply(() => setPopoverOpen(false))}
              onClear={handleClear}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
