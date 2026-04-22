"use client";
import { useCallback, useEffect, useState } from "react";
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
import { defaultFilters, FilterState } from "@/types/filter";

interface FilterTriggerProps {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
}

export const FilterTrigger = ({
  filters,
  onApply,
  onClear,
}: FilterTriggerProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    onClear();
    setLocalFilters(defaultFilters);
    setOpen(false);
  };

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  return (
    <>
      <div className="block">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 hover:bg-transparent hover:text-primary p-0 text-sm"
            >
              <FilterIcon className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="data-[side=top]:max-h-[50vh]">
            <SheetHeader className="text-left">
              <SheetTitle className="text-primary text-xl font-bold">
                Filter
              </SheetTitle>
            </SheetHeader>
            <FilterBody filters={localFilters} onChange={setLocalFilters} />
            <SheetFooter>
              <div className="flex gap-3 pt-2">
                {/* <SheetClose asChild> */}
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 rounded-xl border-primary text-primary hover:bg-primary/5"
                >
                  Clear Filters
                </Button>
                {/* </SheetClose> */}
                <Button className="flex-1 rounded-xl" onClick={handleApply}>
                  Apply Filters
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
