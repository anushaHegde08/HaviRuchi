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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DIFFICULTIES } from "@/mockData/constatnts";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, MinusCircle, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AddField } from "@/types";
import AddFields from "@/components/add-recipes/AddFields";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

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

  const handleSubmit = () => {
    // const recipeData = {
    //   ingredients: ingredients.map((ingredient) => ingredient.value),
    //   instructions: instructions.map((instruction) => instruction.value),
    // };
    // console.log(recipeData);
    console.log("Submit button clicked");
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
                    {/* <FieldGroup> */}
                    <Field>
                      <FieldLabel htmlFor="title">Recipe Title</FieldLabel>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g., Pineapple Gojju"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="description">
                        Description{" "}
                        <Typography
                          variant="xsmall"
                          className="ml-auto text-muted-foreground"
                        >
                          0/120
                        </Typography>
                      </FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Describe your traditional dish..."
                        rows={4}
                        maxLength={120}
                      />
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
                      <Select defaultValue="">
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="difficulty">
                        Difficulty Level
                      </FieldLabel>
                      <Tabs defaultValue="easy">
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
                            min={0}
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
                        </FieldGroup>
                      </Field>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="servings">Servings</FieldLabel>
                      <Input
                        id="servings"
                        type="number"
                        placeholder="Number of servings"
                        required
                      />
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
                  />

                  <AddFields
                    fields={instructions}
                    onChange={setInstructions}
                    placeholder="e.g., Roast the red chilies with a teaspoon of oil..."
                    label="Instructions"
                  />
                </div>

                {/* </FieldGroup> */}
              </FieldSet>
              <Separator className="my-6" />
              {/* <Field orientation="horizontal" className="gap-4 pb-4"> */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border-primary text-primary"
                >
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit} className="flex-1">
                  Submit
                </Button>
              </div>
              {/* </Field> */}
            </FieldGroup>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddRecipe;
