import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const countOnly = searchParams.get("countOnly") === "true";

    await connectDB();

    // find user by email to get MongoDB _id
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (countOnly) {
      const count = await Recipe.countDocuments({ createdBy: user._id });
      return NextResponse.json({ count });
    }

    // find recipes created by this user
    const recipes = await Recipe.find({ createdBy: user._id })
      .select(
        "_id title description image category difficulty timeNeeded servings isFavorite status reviewNote createdBy",
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Get my recipes error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
