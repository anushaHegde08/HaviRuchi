import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const recipe = await Recipe.findById(id)
      .populate("createdBy", "name email")
      .lean();

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Get recipe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // find recipe
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // check ownership
    if (recipe.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "You can only edit your own recipes" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const calculatedDifficulty =
      body.timeNeeded <= 30
        ? "Easy"
        : body.timeNeeded <= 60
        ? "Medium"
        : "Hard";

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: calculatedDifficulty,
        timeNeeded: body.timeNeeded,
        servings: body.servings,
        image: body.image,
        // transform same as POST
        ingredients: body.ingredients.map(
          (i: { value: string; measurement: string }) =>
            `${i.value} - ${i.measurement}`,
        ),
        instructions: body.instructions.map((i: { value: string }) => i.value),
      },
      { returnDocument: "after" },
    );

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error("Update recipe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // find recipe
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // check ownership
    if (recipe.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "You can only delete your own recipes" },
        { status: 403 },
      );
    }

    await Recipe.findByIdAndDelete(id);

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
