import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirst } from "@/lib/utilities/helperFunction";
import { cn } from "@/lib/utils";
import { MinusCircle, PlusCircle } from "lucide-react";

export interface IngredientFieldProps {
  id: number;
  name: string;
  quantity: number | null;
  unit: string;
  customUnit?: string;
}

interface IngredientFieldsProps {
  fields: IngredientFieldProps[];
  onChange: (fields: IngredientFieldProps[]) => void;
  hasError?: boolean;
  onClearError?: () => void;
}

const UNIT_OPTIONS = [
  "cup",
  "tbsp",
  "tsp",
  "g",
  "kg",
  "ml",
  "l",
  "piece",
  "whole",
  "pinch",
  "sprig",
  "clove",
  "leaf",
  "handful",
  "inch",
  "to taste",
  "Other",
];

export const IngredientFields = ({
  fields,
  onChange,
  hasError = false,
  onClearError,
}: IngredientFieldsProps) => {
  const addField = () => {
    if (onClearError) onClearError();
    const newId =
      fields.length > 0 ? Math.max(...fields.map((f) => f.id)) + 1 : 1;
    onChange([...fields, { id: newId, name: "", quantity: null, unit: "cup" }]);
  };

  const removeField = (id: number) => {
    if (fields.length === 1) return;
    if (onClearError) onClearError();
    onChange(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: number, updates: Partial<IngredientFieldProps>) => {
    if (onClearError) onClearError();
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Ingredients
      </label>

      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col sm:flex-row gap-2 w-full">
          {/* Line 1 (Mobile) / Left Side (Desktop): Name + Quantity */}
          <div className="flex flex-row gap-2 items-center w-full sm:w-auto sm:flex-[3]">
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none select-none">
                {index + 1}.
              </span>
              <Input
                placeholder="ex: Grated coconut"
                value={field.name}
                onChange={(e) =>
                  updateField(field.id, {
                    name: capitalizeFirst(e.target.value),
                  })
                }
                className={cn(
                  "pl-8 w-full min-w-0 text-sm",
                  hasError && !field.name.trim()
                    ? "border-destructive focus-visible:ring-destructive"
                    : "",
                )}
              />
            </div>

            <Input
              type="number"
              step="0.01"
              placeholder="Qty"
              value={field.quantity ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                updateField(field.id, {
                  quantity: val ? parseFloat(val) : null,
                });
              }}
              className={cn(
                "min-w-0 text-sm shrink-0",
                field.unit === "Other" ? "w-14 sm:w-16" : "w-16 sm:w-20",
              )}
            />
          </div>

          {/* Line 2 (Mobile) / Right Side (Desktop): Unit + Custom + Remove */}
          <div className="flex flex-row gap-2 items-center w-full sm:w-auto sm:flex-[2]">
            <div className="flex flex-row gap-2 flex-1 min-w-0">
              <Select
                value={field.unit || "cup"}
                onValueChange={(val) => {
                  if (val === "Other") {
                    updateField(field.id, { unit: val, customUnit: "" });
                  } else {
                    updateField(field.id, { unit: val, customUnit: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "text-sm shrink-0",
                    field.unit === "Other" ? "w-24" : "w-full",
                    hasError &&
                      (!field.unit ||
                        (field.unit === "Other" && !field.customUnit?.trim()))
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  )}
                >
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {field.unit === "Other" && (
                <Input
                  placeholder="Custom unit"
                  value={field.customUnit || ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      customUnit: capitalizeFirst(e.target.value),
                    })
                  }
                  className={cn(
                    "w-full text-sm min-w-0 flex-1",
                    hasError && !field.customUnit?.trim()
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  )}
                />
              )}
            </div>

            <Button
              variant="ghost"
              className="hover:bg-transparent shrink-0 p-0"
              onClick={() => removeField(field.id)}
              disabled={fields.length === 1}
              type="button"
            >
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-start mt-2">
        <Button
          variant="outline"
          className="w-fit py-0 px-2 h-6 text-muted-foreground hover:bg-primary/15 hover:text-foreground"
          onClick={addField}
          type="button"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Ingredient
        </Button>
      </div>
    </div>
  );
};
