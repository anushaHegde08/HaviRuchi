import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // find user by email to get MongoDB _id
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find recipes created by this user
    const recipes = await Recipe.find({ createdBy: user._id })
      .select("-ingredients -instructions")
      .sort({
        createdAt: -1,
      }); // newest first

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Get my recipes error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
