"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { defaultFilters, FilterState } from "@/types/filter";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { FilterBody } from "./FilterBody";

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

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalFilters(filters);
    }
    setOpen(newOpen);
  };

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

  return (
    <>
      <div className="block">
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 hover:bg-transparent hover:text-primary p-0 text-sm"
            >
              <FilterIcon className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="flex flex-col max-h-[500px]"
            aria-describedby={undefined}
          >
            <SheetHeader className="text-left shrink-0">
              <SheetTitle className="text-primary text-xl font-bold">
                Filter
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto min-h-0">
              <FilterBody filters={localFilters} onChange={setLocalFilters} />
            </div>
            <SheetFooter className="shrink-0">
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 rounded-xl border-primary text-primary hover:bg-primary/5"
                >
                  Clear Filters
                </Button>
                <Button
                  className="flex-1 rounded-xl"
                  onClick={handleApply}
                  disabled={!hasChanges}
                >
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
