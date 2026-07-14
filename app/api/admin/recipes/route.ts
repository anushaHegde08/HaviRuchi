import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Admin API GET - Session role:", session?.user?.role);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    await connectDB();

    const recipes = await Recipe.find({ status })
      .select("_id title description image category difficulty timeNeeded servings status createdAt createdBy")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Admin API GET - Query for status=${status} returned ${recipes.length} recipes.`);

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Admin Get recipes error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
