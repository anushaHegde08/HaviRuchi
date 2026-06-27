import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utilities/helperFunction";
import { HTMLProps } from "react";

interface FilterSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: HTMLProps<HTMLElement>["className"];
}

export const FilterSlider = ({
  value,
  onChange,
  className,
}: FilterSliderProps) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-primary tracking-widest uppercase">
        Max Time
      </p>
      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
        {formatTime(value)}
      </span>
    </div>
    <Slider
      min={15}
      max={120}
      step={5}
      value={[value]}
      onValueChange={([val]) => onChange(val)}
    />
    <div className="flex justify-between mt-1">
      <span className="text-xs text-muted-foreground">15 min</span>
      <span className="text-xs text-muted-foreground">2h+</span>
    </div>
  </div>
);
