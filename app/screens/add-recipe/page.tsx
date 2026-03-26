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

const AddRecipe = () => {
  const [ingredients, setIngredients] = useState<AddField[]>([
    { id: 1, value: "" },
  ]);
  const [instructions, setInstructions] = useState<AddField[]>([
    { id: 1, value: "" },
  ]);

  const handleSubmit = () => {
    // const recipeData = {
    //   ingredients: ingredients.map((ingredient) => ingredient.value),
    //   instructions: instructions.map((instruction) => instruction.value),
    // };
    // console.log(recipeData);
    console.log("Submit button clicked");
  };

  const handleCancel = () => {
    // Reset form or navigate away
    console.log("Cancel button clicked");
  };

  return (
    <div className="flex items-center justify-center px-6 w-full">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="py-4 text-primary flex items-center gap-2">
              <ArrowLeft className="text-primary" /> Add New Recipe
            </FieldLegend>
            <FieldDescription>All the fields are required.</FieldDescription>
            <FieldGroup>
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
                <FieldLabel htmlFor="difficulty">Difficulty Level</FieldLabel>
                <Tabs defaultValue="easy">
                  <TabsList className="bg-primary/10">
                    {DIFFICULTIES.map((level) => (
                      <TabsTrigger key={level} value={level}>
                        {level}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </Field>
              <Field className="flex flex-row gap-4">
                <Field>
                  <FieldLabel htmlFor="time">Cook Time</FieldLabel>
                  <Field className="flex flex-row items-center">
                    <Input
                      id="time"
                      type="number"
                      placeholder="Time"
                      min={15}
                      max={55}
                      step={5}
                      required
                    />
                    <Typography
                      variant="body"
                      className="ml-2 text-muted-foreground"
                    >
                      Minutes
                    </Typography>
                    {/* <Select defaultValue="">
                      <SelectTrigger id="units">
                        <SelectValue placeholder="Units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem key="minutes" value="minutes">
                            Minutes
                          </SelectItem>
                          <SelectItem key="hours" value="hours">
                            Hours
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select> */}
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
              </Field>
              {/* <Field>
                <FieldLabel htmlFor="img-url">Image URL</FieldLabel>
                <Input id="img-url" type="url" placeholder="Paste image link" />
              </Field> */}
              <Field>
                <FieldLabel htmlFor="picture">Image</FieldLabel>
                <Input
                  id="picture"
                  type="file"
                  className="h-auto file:text-foreground/75 text-muted-foreground"
                />
                <FieldDescription className="text-xs">
                  Select a picture to upload.
                </FieldDescription>
              </Field>
              <AddFields
                fields={ingredients}
                onChange={setIngredients}
                placeholder="e.g., 1 cup Grated coconut"
                label="Ingredients"
              />
              <AddFields
                fields={instructions}
                onChange={setInstructions}
                placeholder="e.g., Roast the red chilies with a teaspoon of oil..."
                label="Instructions"
              />
            </FieldGroup>
          </FieldSet>
          <Separator />
          <Field orientation="horizontal" className="gap-4 pb-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="w-1/2 border-primary text-primary"
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} className="w-1/2">
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default AddRecipe;
