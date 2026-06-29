import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// get user favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!user.favorites || user.favorites.length === 0) {
      return NextResponse.json([]);
    }
    // manually fetch recipes instead of populate
    const Recipe = (await import("@/models/Recipe")).default;
    const favoriteRecipes = await Recipe.find({
      _id: { $in: user.favorites },
    })
      .select("_id")
      .lean();

    return NextResponse.json(
      favoriteRecipes.map((recipe) => recipe._id.toString()),
    );
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// toggle favorite
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await req.json();

    await connectDB();

    const Recipe = (await import("@/models/Recipe")).default;
    const recipeExists = await Recipe.findById(recipeId).lean();
    if (!recipeExists) {
      return NextResponse.json(
        { error: "This recipe no longer exists" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // check if already favorited
    const isFavorited = (user.favorites || []).some(
      (id: mongoose.Types.ObjectId) => id.toString() === recipeId,
    );

    if (isFavorited) {
      // remove from favorites
      user.favorites = (user.favorites || []).filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== recipeId,
      );
    } else {
      if (!user.favorites) user.favorites = []; // ← initialize if undefined
      // add to favorites
      user.favorites.push(recipeId);
    }

    await user.save();

    return NextResponse.json({
      isFavorited: !isFavorited,
      message: isFavorited ? "Removed from favorites" : "Added to favorites",
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
