import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";

interface ServingsSelectorProps {
  selectedServings: number;
  onServingsChange: (servings: number) => void;
}

export const ServingsSelector = ({
  selectedServings,
  onServingsChange,
}: ServingsSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex flex-shrink-0 w-fit items-center gap-1 text-[8px] md:text-base lg:text-lg py-1 px-3 rounded-full border",
            "text-pink-500 border-pink-200 bg-pink-50/5 hover:bg-pink-100/50 cursor-pointer transition-colors",
          )}
        >
          <Users className="h-3 md:h-4 lg:h-5 w-3 md:w-4 lg:w-5" />
          <div className="text-nowrap flex items-center gap-1">
            Serves {selectedServings}
            <ChevronDown className="h-3 md:h-4 w-3 md:w-4 ml-0.5" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1 shadow-md rounded-xl" align="start">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onServingsChange(Math.max(1, selectedServings - 1))}
            disabled={selectedServings <= 1}
            className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          <span className="font-medium text-xs md:text-base lg:text-lg w-6 text-center">
            {selectedServings}
          </span>
          <button
            onClick={() => onServingsChange(selectedServings + 1)}
            className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
