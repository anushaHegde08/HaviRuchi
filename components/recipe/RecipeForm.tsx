"use client";
import AddFields from "@/components/add-recipes/AddFields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/uploadImage";
import { CATEGORIES } from "@/lib/utilities/constatnts";
import { capitalizeFirst } from "@/lib/utilities/helperFunction";
import { cn } from "@/lib/utils";
import { AddField } from "@/types";
import { ArrowLeft, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ButtonLoadingSpinner from "../loading/ButtonLoadingSpinner";

export interface RecipeFormData {
  title: string;
  description: string;
  category: string;
  hours: number;
  minutes: number;
  servings: number | "";
  ingredients: AddField[];
  instructions: AddField[];
  image?: string;
}

interface RecipeFormProps {
  initialData?: RecipeFormData; // empty = add, filled = edit
  onSubmit: (data: RecipeFormData, totalMinutes: number) => Promise<void>;
  buttonLoading: boolean;
  pageTitle: string; // "Add New Recipe" or "Edit Recipe"
  submitLabel: string; // "Submit" or "Update Recipe"
  onFormChange?: () => void;
  submitDisabled?: boolean;
  onBeforeSubmit?: () => void;
  onValidationFailed?: () => void;
}

const LazyImageCropper = dynamic(
  () =>
    import("@/components/add-recipes/ImageCropper").then(
      (mod) => mod.ImageCropper,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
    ),
  },
);

const defaultData: RecipeFormData = {
  title: "",
  description: "",
  image: "",
  category: "",
  hours: 0,
  minutes: 10,
  servings: "",
  ingredients: [{ id: 1, value: "", measurement: "" }],
  instructions: [{ id: 1, value: "" }],
};

const RecipeForm = ({
  initialData = defaultData,
  onSubmit,
  buttonLoading,
  pageTitle,
  submitLabel,
  onFormChange,
  submitDisabled,
  onBeforeSubmit,
  onValidationFailed,
}: RecipeFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category);
  const [hours, setHours] = useState(initialData.hours);
  const [minutes, setMinutes] = useState(initialData.minutes);
  const [servings, setServings] = useState(initialData.servings);
  const [ingredients, setIngredients] = useState<AddField[]>(
    initialData.ingredients,
  );
  const [instructions, setInstructions] = useState<AddField[]>(
    initialData.instructions,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.image || null,
  );
  const [imageError, setImageError] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageFile: "",
    category: "",
    time: "",
    servings: "",
    ingredients: "",
    instructions: "",
    general: "",
  });

  const clearErrors = () =>
    setErrors({
      title: "",
      description: "",
      imageFile: "",
      category: "",
      time: "",
      servings: "",
      ingredients: "",
      instructions: "",
      general: "",
    });

  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const handleHoursChange = (value: number) => {
    setHours(value);
    if (value === 0 && minutes < 10) setMinutes(10);
    if (value > 0 && minutes > 55) setMinutes(55);
    onFormChange?.();
    if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
  };

  const handleMinutesChange = (value: number) => {
    if (hours === 0 && value < 10) return;
    if (value > 55) return;
    if (value < 0) return;
    setMinutes(value);
    onFormChange?.();
    if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
  };

  const handleServingsChange = (value: number) => {
    if (value < 1) return;
    if (value > 50) return;
    setServings(value);
    onFormChange?.();
    if (errors.servings) setErrors((prev) => ({ ...prev, servings: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError("File size must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPEG, PNG and WebP images are allowed");
      return;
    }

    setImageError("");
    if (errors.imageFile) setErrors((prev) => ({ ...prev, imageFile: "" }));
    setImageFile(file);
    // read file and open cropper
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCropperOpen(true); // ← open cropper dialog
    };
    reader.readAsDataURL(file);

    // reset input so same file can be selected again
    e.target.value = "";
    // setImagePreview(URL.createObjectURL(file));
    onFormChange?.();
  };

  const handleCropComplete = (croppedFile: File) => {
    setImageFile(croppedFile);
    setImagePreview(URL.createObjectURL(croppedFile));
    setCropperOpen(false);
    setRawImageSrc(null);
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setRawImageSrc(null);
  };

  const validate = () => {
    clearErrors();
    let hasError = false;
    const newErrors = { ...errors };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      hasError = true;
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
      hasError = true;
    }
    if (!imageFile && !initialData.image) {
      newErrors.imageFile = "Please select an image";
      hasError = true;
    }
    if (!category) {
      newErrors.category = "Please select a category";
      hasError = true;
    }
    if (hours === 0 && minutes < 10) {
      newErrors.time = "Minimum cook time is 10 minutes";
      hasError = true;
    }
    if (!servings || servings < 1) {
      newErrors.servings = "Servings must be at least 1";
      hasError = true;
    }
    if (ingredients.some((i) => !i.value.trim() || !i.measurement?.trim())) {
      newErrors.ingredients = "All ingredient fields must be filled";
      hasError = true;
    }
    if (instructions.some((i) => !i.value.trim())) {
      newErrors.instructions = "All instruction fields must be filled";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    onBeforeSubmit?.();
    if (!validate()) {
      onValidationFailed?.();
      return;
    }

    try {
      // upload image if new one selected
      let imageUrl = initialData.image || "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "recipes");
      }

      const totalMinutes = hours * 60 + minutes;

      await onSubmit(
        {
          title,
          description,
          category,
          hours,
          minutes,
          servings,
          ingredients,
          instructions,
          image: imageUrl,
        },
        totalMinutes,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setErrors((prev) => ({
        ...prev,
        general: message,
      }));
    }
  };

  return (
    <div
      className={cn(
        `${buttonLoading ? "pointer-events-none opacity-50" : ""}`,
        "min-h-screen bg-background px-4 py-6 md:py-12",
      )}
    >
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-6 mb-14 md:mb-0 md:p-10">
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="py-4 text-primary flex items-center gap-2 text-xl md:text-2xl font-bold">
                  <ArrowLeft
                    className="cursor-pointer"
                    onClick={() => router.back()}
                  />
                  {pageTitle}
                </FieldLegend>
                <FieldDescription>All fields are required.</FieldDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor="title">Recipe Title</FieldLabel>
                      <Input
                        id="title"
                        type="text"
                        placeholder="ex: Pineapple Gojju"
                        value={title}
                        className={
                          errors.title
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                        onChange={(e) => {
                          setTitle(capitalizeFirst(e.target.value));
                          onFormChange?.();
                          if (errors.title)
                            setErrors((prev) => ({ ...prev, title: "" }));
                        }}
                      />
                      {errors.title && (
                        <p className="text-xs text-destructive">
                          {errors.title}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Describe your traditional dish..."
                        rows={4}
                        value={description}
                        className={cn(
                          "text-sm",
                          errors.description
                            ? "border-destructive focus-visible:ring-destructive"
                            : "",
                        )}
                        onChange={(e) => {
                          setDescription(capitalizeFirst(e.target.value));
                          onFormChange?.();
                          if (errors.description)
                            setErrors((prev) => ({ ...prev, description: "" }));
                        }}
                      />
                      {errors.description && (
                        <p className="text-xs text-destructive">
                          {errors.description}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="picture">Recipe Image</FieldLabel>
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Recipe preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <Input
                        id="picture"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className={cn(
                          "h-auto file:text-foreground/75 text-muted-foreground",
                          errors.imageFile
                            ? "border-destructive focus-visible:ring-destructive"
                            : "",
                        )}
                        onChange={handleImageChange}
                      />
                      <FieldDescription className="text-xs">
                        (Max 5MB, JPEG/PNG/WebP/JPG).
                      </FieldDescription>
                      {imageError && (
                        <p className="text-xs text-destructive">{imageError}</p>
                      )}
                      {errors.imageFile && (
                        <p className="text-xs text-destructive">
                          {errors.imageFile}
                        </p>
                      )}
                    </Field>
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Select
                        value={category}
                        onValueChange={(val) => {
                          setCategory(val);
                          onFormChange?.();
                          if (errors.category)
                            setErrors((prev) => ({ ...prev, category: "" }));
                        }}
                      >
                        <SelectTrigger
                          id="category"
                          className={
                            errors.category
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={4}
                          className="w-[var(--radix-select-trigger-width)]"
                        >
                          <SelectGroup>
                            {CATEGORIES.filter((c) => c !== "All").map(
                              (cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-xs text-destructive">
                          {errors.category}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel>Cook Time</FieldLabel>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-muted disabled:active:bg-muted"
                            onClick={() =>
                              handleHoursChange(Math.max(0, hours - 1))
                            }
                            disabled={hours === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min={0}
                            max={5}
                            step={1}
                            value={hours}
                            onChange={(e) =>
                              handleHoursChange(Number(e.target.value))
                            }
                            className={cn(
                              "w-16 text-center",
                              errors.time
                                ? "border-destructive focus-visible:ring-destructive"
                                : "",
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-muted disabled:active:bg-muted"
                            onClick={() =>
                              handleHoursChange(Math.min(5, hours + 1))
                            }
                            disabled={hours === 5}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-muted-foreground text-xs ml-1">
                            Hr
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-muted disabled:active:bg-muted"
                            onClick={() =>
                              handleMinutesChange(
                                hours === 0
                                  ? Math.max(10, minutes - 5)
                                  : Math.max(0, minutes - 5),
                              )
                            }
                            disabled={
                              (hours === 0 && minutes <= 10) ||
                              (hours > 0 && minutes === 0)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min={hours === 0 ? 10 : 0}
                            max={55}
                            step={5}
                            value={minutes}
                            onChange={(e) =>
                              handleMinutesChange(Number(e.target.value))
                            }
                            className={cn(
                              "w-16 text-center",
                              errors.time
                                ? "border-destructive focus-visible:ring-destructive"
                                : "",
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-muted disabled:active:bg-muted"
                            onClick={() =>
                              handleMinutesChange(Math.min(55, minutes + 5))
                            }
                            disabled={minutes === 55}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-muted-foreground text-xs ml-1">
                            Min
                          </span>
                        </div>
                      </div>
                      {errors.time && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.time}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="servings">Servings</FieldLabel>
                      <div className="flex items-center w-fit border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            handleServingsChange(
                              Math.max(1, Number(servings) - 1),
                            )
                          }
                          disabled={Number(servings) <= 1}
                          className="px-3 py-1 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronDown className="h-4 w-4 text-primary" />
                        </button>
                        <span className="px-4 py-1 text-sm font-medium border-y w-full text-center min-w-[3rem]">
                          {servings || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleServingsChange(
                              Math.min(50, Number(servings) + 1),
                            )
                          }
                          disabled={Number(servings) >= 50}
                          className="px-3 py-1 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronUp className="h-4 w-4 text-primary" />
                        </button>
                      </div>
                      {errors.servings && (
                        <p className="text-xs text-destructive">
                          {errors.servings}
                        </p>
                      )}
                    </Field>
                  </div>
                </div>

                {/* Full width */}
                <div className="flex flex-col gap-4 mt-6">
                  <AddFields
                    fields={ingredients}
                    onChange={(fields) => {
                      setIngredients(fields);
                      onFormChange?.();
                    }}
                    placeholder="ex: Grated coconut"
                    label="Ingredients"
                    showMeasurement={true}
                    hasError={!!errors.ingredients}
                    onClearError={() =>
                      setErrors((prev) => ({ ...prev, ingredients: "" }))
                    }
                  />
                  {errors.ingredients && (
                    <p className="text-xs text-destructive">
                      {errors.ingredients}
                    </p>
                  )}

                  <AddFields
                    fields={instructions}
                    onChange={(fields) => {
                      setInstructions(fields);
                      onFormChange?.();
                    }}
                    placeholder="ex: Roast the red chilies..."
                    label="Instructions"
                    hasError={!!errors.instructions}
                    onClearError={() =>
                      setErrors((prev) => ({ ...prev, instructions: "" }))
                    }
                  />
                  {errors.instructions && (
                    <p className="text-xs text-destructive">
                      {errors.instructions}
                    </p>
                  )}
                </div>

                {errors.general && (
                  <p className="text-xs text-destructive text-center mt-2">
                    {errors.general}
                  </p>
                )}
              </FieldSet>

              <Separator className="my-6" />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 border-primary text-primary"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={buttonLoading || submitDisabled}
                  className="flex-1"
                >
                  {buttonLoading ? (
                    <ButtonLoadingSpinner loadingText="Saving..." />
                  ) : (
                    submitLabel
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Card>
      </div>
      {rawImageSrc && (
        <LazyImageCropper
          open={cropperOpen}
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default RecipeForm;
