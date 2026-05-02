import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

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
    const favorites = await Recipe.find({
      _id: { $in: user.favorites },
    });
    return NextResponse.json(user.favorites);
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
    console.log("favorites POST called");
    const session = await getServerSession(authOptions);
    console.log("1. session:", session?.user?.email);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await req.json();
    console.log("2. recipeId:", recipeId);

    await connectDB();
    console.log("3. DB connected");

    const user = await User.findOne({ email: session.user.email });
    console.log("4. user:", user?._id);

    console.log("user found:", user?._id, "favorites:", user?.favorites);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // check if already favorited
    const isFavorited = (user.favorites || []).some(
      (id: mongoose.Types.ObjectId) => id.toString() === recipeId,
    );
    console.log("5. isFavorited:", isFavorited);

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
