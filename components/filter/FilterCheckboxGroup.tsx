import { Checkbox } from "@/components/ui/checkbox";
import { HTMLProps } from "react";

interface FilterCheckboxGroupProps {
  title: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: HTMLProps<HTMLElement>["className"];
}

export const FilterCheckboxGroup = ({
  title,
  items,
  selected,
  onChange,
  className,
}: FilterCheckboxGroupProps) => {
  const toggle = (item: string) => {
    selected.includes(item)
      ? onChange(selected.filter((i) => i !== item))
      : onChange([...selected, item]);
  };

  return (
    <div className={`flex flex-col gap-2 md:gap-3 ${className}`}>
      <p className="text-sm font-semibold text-primary tracking-widest uppercase">
        {title}
      </p>
      {items.map((item) => (
        <div key={item} className="flex items-center justify-between">
          <label htmlFor={item} className="text-sm cursor-pointer flex-1">
            {item}
          </label>
          <Checkbox
            id={item}
            checked={selected.includes(item)}
            onCheckedChange={() => toggle(item)}
            className="h-5 w-5 border-[1px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      ))}
    </div>
  );
};
