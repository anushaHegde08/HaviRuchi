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
import { categories } from "@/mockData/constatnts";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, MinusCircle, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AddRecipe = () => {
  return (
    <div className="flex items-center justify-center w-full">
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
                    variant="small"
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
                      {categories.map((category) => (
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
                    <TabsTrigger value="easy">Easy</TabsTrigger>
                    <TabsTrigger value="medium">Medium</TabsTrigger>
                    <TabsTrigger value="hard">Hard</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Field>
              <Field className="flex flex-row gap-4">
                <Field>
                  <FieldLabel htmlFor="time">Cook Time</FieldLabel>
                  <Field className="flex flex-row">
                    <Input
                      id="time"
                      type="number"
                      placeholder="Time"
                      min={1}
                      required
                    />
                    <Select defaultValue="">
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
                    </Select>
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
              <Field>
                <FieldLabel htmlFor="img-url">Image URL</FieldLabel>
                <Input id="img-url" type="url" placeholder="Paste image link" />
              </Field>

              <Field className="flex flex-row gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="ingredients"
                    className="flex items-center"
                  >
                    Ingredients
                    <Button
                      variant="ghost"
                      className="bg-transparent hover:bg-transparent ml-auto"
                    >
                      <PlusCircle /> Add Ingredient
                    </Button>
                  </FieldLabel>
                  <div className="flex flex-row items-center gap-2">
                    <Input
                      id="ingredients"
                      placeholder="e.g., Grated coconut"
                      className="flex-[2]"
                      required
                    />
                    <Input
                      id="quantity"
                      placeholder="2 cups"
                      className="flex-[1]"
                      required
                    />
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent shrink-0 p-0"
                    >
                      <MinusCircle />
                    </Button>
                  </div>
                </Field>
              </Field>
              <Field className="flex flex-row gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="instructions"
                    className="flex items-center"
                  >
                    Instructions
                    <Button
                      variant="ghost"
                      className="bg-transparent hover:bg-transparent ml-auto"
                    >
                      <PlusCircle /> Add Instruction
                    </Button>
                  </FieldLabel>
                  <div className="flex flex-row items-center gap-2">
                    <Typography
                      variant="caption"
                      className="text-muted-foreground shrink-0"
                    >
                      Step 1:
                    </Typography>
                    <Input
                      id="instructions"
                      placeholder="Roast the red chilies with a teaspoon of oil..."
                      className="flex-1"
                      required
                    />
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent shrink-0 p-0"
                    >
                      <MinusCircle />
                    </Button>
                  </div>
                </Field>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Separator />
          <Field orientation="horizontal" className="gap-4 pb-4">
            <Button
              variant="outline"
              type="button"
              className="w-1/2 border-primary text-primary"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-1/2">
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default AddRecipe;
