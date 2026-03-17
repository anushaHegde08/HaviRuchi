import { Checkbox } from "@/components/ui/checkbox";

interface FilterCheckboxGroupProps {
  title: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const FilterCheckboxGroup = ({
  title,
  items,
  selected,
  onChange,
}: FilterCheckboxGroupProps) => {
  const toggle = (item: string) => {
    selected.includes(item)
      ? onChange(selected.filter((i) => i !== item))
      : onChange([...selected, item]);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-primary tracking-widest uppercase">
        {title}
      </p>
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center justify-between py-1 border-b border-muted last:border-0"
        >
          <label htmlFor={item} className="text-sm cursor-pointer flex-1">
            {item}
          </label>
          <Checkbox
            id={item}
            checked={selected.includes(item)}
            onCheckedChange={() => toggle(item)}
            className="rounded-full h-6 w-6 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      ))}
    </div>
  );
};
