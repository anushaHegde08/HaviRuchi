import { capitalizeFirst } from "@/lib/utilities/helperFunction";
import { cn } from "@/lib/utils";
import { AddField } from "@/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface DynamicFieldsProps {
  fields: AddField[];
  onChange: (fields: AddField[]) => void;
  placeholder: string;
  label: string;
  showMeasurement?: boolean;
  hasError?: boolean;
  onClearError?: () => void;
}

interface SortableItemProps {
  field: AddField;
  index: number;
  label: string;
  placeholder: string;
  showMeasurement: boolean;
  hasError: boolean;
  fieldsLength: number;
  update: (id: number, value: string) => void;
  updateMeasurement: (id: number, measurement: string) => void;
  remove: (id: number) => void;
}

const SortableItem = ({
  field,
  index,
  label,
  placeholder,
  showMeasurement,
  hasError,
  fieldsLength,
  update,
  updateMeasurement,
  remove,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id.toString(), disabled: fieldsLength === 1 });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-1.5 items-center w-full relative"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        disabled={fieldsLength === 1}
        className={cn(
          "shrink-0 touch-none",
          fieldsLength === 1
            ? "opacity-50 cursor-not-allowed text-muted-foreground/50"
            : "cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary",
        )}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div
        className={cn(
          "relative",
          label === "Ingredients" ? "flex-[3]" : "flex-1",
        )}
      >
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none select-none">
          {index + 1}.
        </span>
        <Input
          placeholder={placeholder}
          value={field.value}
          onChange={(e) => update(field.id, e.target.value)}
          className={cn(
            "pl-8 w-full min-w-0 text-sm",
            hasError && !field.value.trim()
              ? "border-destructive focus-visible:ring-destructive"
              : "",
          )}
        />
      </div>

      {showMeasurement && (
        <Input
          placeholder="ex: 1 cup"
          value={field.measurement ?? ""}
          onChange={(e) => updateMeasurement(field.id, e.target.value)}
          className={cn(
            "flex-[1] min-w-0 w-16 text-sm",
            hasError && !field.measurement?.trim()
              ? "border-destructive focus-visible:ring-destructive"
              : "",
          )}
        />
      )}

      <Button
        variant="ghost"
        className="hover:bg-transparent shrink-0 p-0"
        onClick={() => remove(field.id)}
        disabled={fieldsLength === 1}
        type="button"
      >
        <MinusCircle className="h-5 w-5" />
      </Button>
    </div>
  );
};

const AddFields = ({
  fields,
  onChange,
  placeholder,
  label,
  showMeasurement = false,
  hasError = false,
  onClearError,
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
      fields.map((item) =>
        item.id === id ? { ...item, value: capitalizeFirst(value) } : item,
      ),
    );
    onClearError?.();
  };

  const updateMeasurement = (id: number, measurement: string) => {
    onChange(
      fields.map((item) => (item.id === id ? { ...item, measurement } : item)),
    );
    onClearError?.();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id.toString() === active.id);
      const newIndex = fields.findIndex((f) => f.id.toString() === over.id);
      onChange(arrayMove(fields, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Field>
        <FieldLabel htmlFor={label} className="flex items-center">
          {label}
        </FieldLabel>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <SortableItem
                key={field.id}
                field={field}
                index={index}
                label={label}
                placeholder={placeholder}
                showMeasurement={showMeasurement}
                hasError={hasError}
                fieldsLength={fields.length}
                update={update}
                updateMeasurement={updateMeasurement}
                remove={remove}
              />
            ))}
          </SortableContext>
        </DndContext>
        <div className="flex justify-start mt-2">
          <Button
            variant="outline"
            className="w-fit py-0 px-2 h-6 text-muted-foreground hover:bg-primary/15 hover:text-foreground"
            onClick={add}
            type="button"
          >
            <PlusCircle className="h-4 w-4" /> Add{" "}
            {label === "Ingredients" ? "Ingredient" : "Instruction"}
          </Button>
        </div>
      </Field>
    </div>
  );
};

export default AddFields;
