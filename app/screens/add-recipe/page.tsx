"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
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
import { CATEGORIES, DIFFICULTIES } from "@/mockData/constatnts";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { AddField } from "@/types";
import AddFields from "@/components/add-recipes/AddFields";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { capitalizeFirst } from "@/lib/utilities/helperFunction";

const AddRecipe = () => {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<AddField[]>([
    { id: 1, value: "" },
  ]);
  const [instructions, setInstructions] = useState<AddField[]>([
    { id: 1, value: "" },
  ]);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [servings, setServings] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    time: "",
    servings: "",
    ingredients: "",
    instructions: "",
    general: "",
  });

  const handleHoursChange = (value: number) => {
    setHours(value);
    // if hours becomes 0, minimum minutes is 10
    if (value === 0 && minutes < 10) {
      setMinutes(10);
    }
  };

  const handleMinutesChange = (value: number) => {
    // if hours is 0, don't allow less than 10 mins
    if (hours === 0 && value < 10) return;
    setMinutes(value);
  };

  const clearErrors = () =>
    setErrors({
      title: "",
      description: "",
      category: "",
      time: "",
      servings: "",
      ingredients: "",
      instructions: "",
      general: "",
    });

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
      setLoading(true);
      const totalMinutes = hours * 60 + minutes;
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          timeNeeded: totalMinutes,
          servings: Number(servings),
          ingredients,
          instructions,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors((prev) => ({ ...prev, general: data.error }));
        return;
      }
      toast.success("Recipe added successfully!");
      router.push("/screens/discover");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:py-12">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-6 mb-14 md:mb-0 md:p-10">
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="py-4 text-primary flex items-center gap-2 text-xl md:text-2xl font-bold">
                  <ArrowLeft className="text-primary cursor-pointer" /> Add New
                  Recipe
                </FieldLegend>
                <FieldDescription>
                  All the fields are required.
                </FieldDescription>

                {/* Two column grid on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ── Left Column ── */}
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
                            setErrors((prev) => ({ ...prev, title: "" })); // ← clear on type
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
                        Description{" "}
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
                      <FieldLabel htmlFor="picture">Image</FieldLabel>
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        className="h-auto file:text-foreground/75 text-muted-foreground"
                      />
                      <FieldDescription className="text-xs">
                        Select a picture to upload.
                      </FieldDescription>
                    </Field>
                  </div>

                  {/* ── Right Column ── */}
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
                              (category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                      <FieldLabel htmlFor="difficulty">
                        Difficulty Level
                      </FieldLabel>
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
                    <Field className="flex flex-row gap-4">
                      <Field>
                        <FieldLabel htmlFor="time">Cook Time</FieldLabel>
                        <FieldGroup className="flex flex-row items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={5}
                            step={1}
                            value={hours}
                            onChange={(e) =>
                              handleHoursChange(Number(e.target.value))
                            }
                            className="w-20 flex-1"
                          />
                          <span className="text-muted-foreground shrink-0">
                            <Typography variant="body">Hour</Typography>
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
                            className="w-20 flex-1"
                          />
                          <span className="text-muted-foreground shrink-0">
                            <Typography variant="body">Minutes</Typography>
                          </span>
                          {errors.time && (
                            <p className="text-xs text-destructive">
                              {errors.time}
                            </p>
                          )}
                        </FieldGroup>
                      </Field>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="servings">Servings</FieldLabel>
                      <Input
                        id="servings"
                        type="number"
                        placeholder="Number of servings"
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
                {/* ── Full width — Ingredients + Instructions ── */}
                <div className="flex flex-col gap-4 mt-6">
                  <AddFields
                    fields={ingredients}
                    onChange={setIngredients}
                    placeholder="e.g.,Grated coconut"
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
                    placeholder="e.g., Roast the red chilies with a teaspoon of oil..."
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
              </FieldSet>
              {errors.general && (
                <p className="text-xs text-destructive text-center mt-2">
                  {errors.general}
                </p>
              )}

              <FieldSeparator className="my-4" />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
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
                  {loading ? "Adding Recipe..." : "Submit"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddRecipe;
