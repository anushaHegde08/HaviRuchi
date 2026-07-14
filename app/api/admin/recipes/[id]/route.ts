import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import { Resend } from "resend";
import Recipe, { IRecipe } from "@/models/Recipe";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { status, reviewNote } = body;

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (status === "rejected" && (!reviewNote || reviewNote.trim() === "")) {
      return NextResponse.json({ error: "Review note is required for rejection" }, { status: 400 });
    }

    await connectDB();

    const updateData: Partial<Pick<IRecipe, 'status' | 'reviewNote'>> = { status };
    if (reviewNote !== undefined) {
      updateData.reviewNote = reviewNote;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' }
    ).populate("createdBy", "name email");

    if (!updatedRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Send email notification
    if (process.env.RESEND_API_KEY && updatedRecipe.createdBy?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const userEmail = updatedRecipe.createdBy.email;
      const userName = updatedRecipe.createdBy.name;
      const recipeTitle = updatedRecipe.title;

      try {
        if (status === "rejected") {
          const { error } = await resend.emails.send({
            from: "noreply@haviruchi.com",
            to: userEmail,
            subject: "Action Required: Recipe Submission Needs Review",
            html: `<p>Hi ${userName},</p>
                   <p>Thank you for submitting your recipe "<strong>${recipeTitle}</strong>".</p>
                   <p>Unfortunately, we are unable to approve it at this time. Our admin has left the following note:</p>
                   <blockquote style="background: #f9f9f9; border-left: 4px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">${reviewNote}</blockquote>
                   <p>You can edit and resubmit your recipe from the "My Recipes" page.</p>`
          });
          if (error) console.error("Resend delivery error for rejection:", error);
        } else if (status === "approved" && reviewNote) {
          const { error } = await resend.emails.send({
            from: "noreply@haviruchi.com",
            to: userEmail,
            subject: "Your Recipe has been Approved!",
            html: `<p>Hi ${userName},</p>
                   <p>Great news! Your recipe "<strong>${recipeTitle}</strong>" has been approved and is now live on HaviRuchi.</p>
                   <p>Our admin left a note for you:</p>
                   <blockquote style="background: #f9f9f9; border-left: 4px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">${reviewNote}</blockquote>`
          });
          if (error) console.error("Resend delivery error for approval:", error);
        } else if (status === "approved") {
          // No email for plain approval
        }
      } catch (err) {
        console.error("Failed to send review email to user", err);
      }
    }

    return NextResponse.json(
      { message: `Recipe ${status} successfully`, recipe: updatedRecipe },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin update recipe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
