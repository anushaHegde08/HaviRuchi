import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { z } from "zod";
import User from "@/models/User";

const AddRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"] as const, {
    message: "Please select a difficulty level",
  }),
  timeNeeded: z.number().min(10, "Minimum cook time is 10 minutes"),
  servings: z.number().min(1, "Servings must be at least 1"),
  ingredients: z
    .array(
      z.object({
        id: z.number(),
        value: z.string().min(1, "Ingredient name cannot be empty"),
        measurement: z.string().min(1, "Measurement cannot be empty"),
      }),
    )
    .min(1, "Add at least one ingredient"),
  instructions: z
    .array(
      z.object({
        id: z.number(),
        value: z.string().min(1, "Instruction cannot be empty"),
        measurement: z.string().optional(),
      }),
    )
    .min(1, "Add at least one instruction"),
});

export async function POST(req: Request) {
  try {
    // check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to add a recipe" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // validate
    const result = AddRecipeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      category,
      difficulty,
      timeNeeded,
      servings,
      ingredients,
      instructions,
    } = result.data;

    await connectDB();

    // find the actual MongoDB user by email
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // save to MongoDB
    const recipe = await Recipe.create({
      title,
      description,
      category,
      difficulty,
      timeNeeded,
      servings,
      ingredients: ingredients.map((i) => `${i.value} - ${i.measurement}`),
      instructions: instructions.map((i) => i.value),
      isFavorite: false,
      createdBy: dbUser._id,
    });

    return NextResponse.json(
      { message: "Recipe added successfully", recipe },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add recipe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const recipes = await Recipe.find()
      .populate("createdBy", "name email") // ← get user details
      .sort({ createdAt: -1 }); // ← newest first

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Get recipes error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
