import { Slider } from "@/components/ui/slider";

const TIME_LABELS = ["15M", "30M", "45M", "1H", "1H+"];

interface FilterSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const FilterSlider = ({ value, onChange }: FilterSliderProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-primary tracking-widest uppercase">
        Max Time
      </p>
      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
        {value}M
      </span>
    </div>
    <Slider
      min={15}
      max={75}
      step={15}
      value={[value]}
      onValueChange={([val]) => onChange(val)}
    />
    <div className="flex justify-between">
      {TIME_LABELS.map((label) => (
        <span key={label} className="text-xs text-muted-foreground">
          {label}
        </span>
      ))}
    </div>
  </div>
);
