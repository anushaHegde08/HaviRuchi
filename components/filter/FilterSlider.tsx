import { HTMLProps } from "react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utilities/helperFunction";

const TIME_LABELS = ["15M", "30M", "45M", "1H", "1H+"];

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
      max={180}
      step={5}
      value={[value]}
      onValueChange={([val]) => onChange(val)}
    />
    {/* <div className="flex justify-between">
      {TIME_LABELS.map((label) => (
        <span key={label} className="text-xs text-muted-foreground">
          {label}
        </span>
      ))}
    </div> */}
    <div className="flex justify-between">
      <span className="text-xs text-muted-foreground"></span>
    </div>
  </div>
);
