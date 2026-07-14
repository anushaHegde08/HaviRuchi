import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    if (recipe.status !== "approved") {
      const session = await getServerSession(authOptions);
      const isOwner = session?.user?.id === recipe.createdBy._id.toString();
      const isAdmin = session?.user?.role === "admin";

      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
      }
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
        // Reset status if it was not already pending, unless the user is an admin
        ...(recipe.status !== "pending" && user.role !== "admin" ? { status: "pending" } : {}),
      },
      { returnDocument: "after" },
    );

    // Send admin notification if status was reset to pending
    if (recipe.status !== "pending" && user.role !== "admin") {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        console.warn("ADMIN_EMAIL is not set in environment variables. Admin notification email skipped.");
      } else if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Admin notification email skipped.");
      } else {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const adminUrl = process.env.NEXTAUTH_URL 
            ? `${process.env.NEXTAUTH_URL}/admin/recipes` 
            : 'http://localhost:3000/admin/recipes';
            
          const { error } = await resend.emails.send({
            from: "noreply@haviruchi.com",
            to: adminEmail,
            subject: "Resubmitted Recipe Pending Approval",
            html: `<p>A recipe "<strong>${updatedRecipe.title}</strong>" has been edited and resubmitted by ${user.name} (${user.email}).</p>
                   <p>Please review and approve or reject it here: <a href="${adminUrl}">Admin Dashboard</a></p>`
          });
          if (error) console.error("Resend delivery error for resubmission:", error);
        } catch (err) {
          console.error("Failed to send admin email on resubmission", err);
        }
      }
    }

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
