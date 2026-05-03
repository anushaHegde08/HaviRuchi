"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, DIFFICULTIES } from "@/mockData/constatnts";
import { AddField } from "@/types";
import AddFields from "@/components/add-recipes/AddFields";
import { uploadImage } from "@/lib/uploadImage";
import { capitalizeFirst } from "@/lib/utilities/helperFunction";
import Image from "next/image";

export interface RecipeFormData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
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
  loading: boolean;
  pageTitle: string; // "Add New Recipe" or "Edit Recipe"
  submitLabel: string; // "Submit" or "Update Recipe"
}

const defaultData: RecipeFormData = {
  title: "",
  description: "",
  image: "",
  category: "",
  difficulty: "Easy",
  hours: 0,
  minutes: 10,
  servings: "",
  ingredients: [{ id: 1, value: "", measurement: "" }],
  instructions: [{ id: 1, value: "" }],
};

const RecipeForm = ({
  initialData = defaultData,
  onSubmit,
  loading,
  pageTitle,
  submitLabel,
}: RecipeFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category);
  const [difficulty, setDifficulty] = useState(initialData.difficulty);
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

  const handleHoursChange = (value: number) => {
    setHours(value);
    if (value === 0 && minutes < 10) setMinutes(10);
  };

  const handleMinutesChange = (value: number) => {
    if (hours === 0 && value < 10) return;
    setMinutes(value);
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
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
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
    if (!validate()) return;

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
          difficulty,
          hours,
          minutes,
          servings,
          ingredients,
          instructions,
          image: imageUrl,
        },
        totalMinutes,
      );
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Something went wrong",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:py-12">
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
                        placeholder="e.g., Pineapple Gojju"
                        value={title}
                        onChange={(e) => {
                          setTitle(capitalizeFirst(e.target.value));
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
                      <FieldLabel htmlFor="description">
                        Description
                        <Typography
                          variant="xsmall"
                          className="ml-auto text-muted-foreground"
                        >
                          {description.length}/120
                        </Typography>
                      </FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Describe your traditional dish..."
                        rows={4}
                        maxLength={120}
                        value={description}
                        onChange={(e) => {
                          setDescription(capitalizeFirst(e.target.value));
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
                        className="h-auto file:text-foreground/75 text-muted-foreground"
                        onChange={handleImageChange}
                      />
                      <FieldDescription className="text-xs">
                        Select a picture to upload(Max 5MB, JPEG/PNG/WebP).
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
                          if (errors.category)
                            setErrors((prev) => ({ ...prev, category: "" }));
                        }}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <FieldLabel>Difficulty Level</FieldLabel>
                      <Tabs value={difficulty} onValueChange={setDifficulty}>
                        <TabsList className="bg-primary/2 border w-full">
                          {DIFFICULTIES.map((level) => (
                            <TabsTrigger
                              key={level}
                              value={level}
                              className="flex-1 data-[state=active]:bg-primary/20"
                            >
                              {level}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </Field>
                    <Field>
                      <FieldLabel>Cook Time</FieldLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={5}
                          step={1}
                          value={hours}
                          onChange={(e) =>
                            handleHoursChange(Number(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-muted-foreground shrink-0">
                          Hr
                        </span>
                        <Input
                          type="number"
                          min={hours === 0 ? 10 : 0}
                          max={55}
                          step={5}
                          value={minutes}
                          onChange={(e) =>
                            handleMinutesChange(Number(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-muted-foreground shrink-0">
                          Min
                        </span>
                      </div>
                      {errors.time && (
                        <p className="text-xs text-destructive">
                          {errors.time}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="servings">Servings</FieldLabel>
                      <Input
                        id="servings"
                        type="number"
                        placeholder="No. of servings"
                        min={1}
                        value={servings}
                        onChange={(e) => {
                          setServings(Number(e.target.value));
                          if (errors.servings)
                            setErrors((prev) => ({ ...prev, servings: "" }));
                        }}
                      />
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
                    onChange={setIngredients}
                    placeholder="e.g., Grated coconut"
                    label="Ingredients"
                    showMeasurement={true}
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
                    onChange={setInstructions}
                    placeholder="e.g., Roast the red chilies..."
                    label="Instructions"
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
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Saving..." : submitLabel}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RecipeForm;
