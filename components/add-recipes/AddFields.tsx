import { AddField } from "@/types";
import { Typography } from "../ui/typography";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";

interface DynamicFieldsProps {
  fields: AddField[];
  onChange: (fields: AddField[]) => void;
  placeholder: string;
  label: string;
  showMeasurement?: boolean;
}

const AddFields = ({
  fields,
  onChange,
  placeholder,
  label,
  showMeasurement = false,
}: DynamicFieldsProps) => {
  const add = () => {
    onChange([...fields, { id: Date.now(), value: "", measurement: "" }]);
  };

  const remove = (id: number) => {
    if (fields.length === 1) return;
    onChange(fields.filter((item) => item.id !== id));
  };

  const update = (id: number, value: string) => {
    onChange(
      fields.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  const updateMeasurement = (id: number, measurement: string) => {
    onChange(
      fields.map((item) => (item.id === id ? { ...item, measurement } : item)),
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Field>
        <FieldLabel htmlFor={label} className="flex items-center">
          {label}
          <Button
            variant="ghost"
            className="bg-transparent hover:bg-transparent ml-auto"
            onClick={add}
          >
            <PlusCircle /> Add {label}
          </Button>
        </FieldLabel>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Typography
              variant="caption"
              className="text-muted-foreground shrink-0"
            >
              {label === "Ingredients" ? `${index + 1}` : `Step ${index + 1}`}
            </Typography>
            <Input
              placeholder={placeholder}
              value={field.value}
              onChange={(e) => update(field.id, e.target.value)}
              className="flex-1"
            />
            {/* Measurement — only for ingredients */}
            {showMeasurement && (
              <Input
                placeholder="e.g., 1 cup"
                value={field.measurement ?? ""}
                onChange={(e) => updateMeasurement(field.id, e.target.value)}
                className="w-28 shrink-0"
              />
            )}
            <Button
              variant="ghost"
              className="hover:bg-transparent shrink-0 p-0"
              onClick={() => remove(field.id)}
              disabled={fields.length === 1}
              type="button"
            >
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </Field>
    </div>
  );
};
export default AddFields;
