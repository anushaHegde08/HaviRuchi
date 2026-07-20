import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import { MAX_DESCRIPTION_LENGTH } from "@/lib/utilities/constatnts";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const dynamic = "force-dynamic";

const AddRecipeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(
        MAX_DESCRIPTION_LENGTH,
        `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`,
      ),
    image: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().nullable().optional(),
    timeNeeded: z.number().min(10, "Minimum cook time is 10 minutes"),
    servings: z.number().min(1, "Servings must be at least 1"),
    ingredients: z
      .array(
        z.object({
          name: z.string().min(1, "Ingredient name cannot be empty"),
          quantity: z.number().nullable(),
          unit: z.string().min(1, "Unit cannot be empty"),
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
  })
  .superRefine((data, ctx) => {
    if (data.category === "Main Course" || data.category === "Sides") {
      if (!data.subCategory || data.subCategory.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SubCategory is required for this category",
          path: ["subCategory"],
        });
      }
    }
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
      subCategory,
      timeNeeded,
      servings,
      ingredients,
      instructions,
    } = result.data;

    const calculatedDifficulty =
      timeNeeded <= 30 ? "Easy" : timeNeeded <= 60 ? "Medium" : "Hard";

    await connectDB();

    // find the actual MongoDB user by email
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is an admin
    const isAdmin = session.user.role === "admin";
    const status = isAdmin ? "approved" : "pending";

    // save to MongoDB
    const recipe = await Recipe.create({
      title,
      description,
      image: result.data.image || "",
      category,
      subCategory: subCategory || null,
      difficulty: calculatedDifficulty,
      timeNeeded,
      servings,
      ingredients,
      instructions: instructions.map((i) => i.value),
      isFavorite: false,
      status,
      createdBy: dbUser._id,
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn(
        "ADMIN_EMAIL is not set in environment variables. Admin notification email skipped.",
      );
    } else if (!process.env.RESEND_API_KEY) {
      console.warn(
        "RESEND_API_KEY is not set. Admin notification email skipped.",
      );
    } else {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminUrl = process.env.NEXTAUTH_URL
          ? `${process.env.NEXTAUTH_URL}/admin/recipes`
          : "http://localhost:3000/admin/recipes";

        const { error } = await resend.emails.send({
          from: "noreply@haviruchi.com",
          to: adminEmail,
          subject: "New Recipe Pending Approval",
          html: `<p>A new recipe "<strong>${title}</strong>" has been submitted by ${dbUser.name} (${dbUser.email}).</p>
                 <p>Please review and approve or reject it here: <a href="${adminUrl}">Admin Dashboard</a></p>`,
        });
        if (error)
          console.error("Resend delivery error for new recipe:", error);
      } catch (err) {
        console.error("Failed to send admin email", err);
      }
    }

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
    // get query params from URL
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categories = searchParams.getAll("category");
    const subCategories = searchParams.getAll("subCategory");
    const difficulties = searchParams.getAll("difficulty");
    const maxTime = searchParams.get("maxTime");

    const andConditions: Record<string, unknown>[] = [];

    // search across title, description, category
    if (search) {
      andConditions.push({
        $or: [
          { title: { $regex: search, $options: "i" } }, // case insensitive
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { subCategory: { $regex: search, $options: "i" } },
        ],
      });
    }

    // filter by categories
    if (categories.length > 0) {
      andConditions.push({ category: { $in: categories } });
    }

    // filter by subCategories
    if (subCategories.length > 0) {
      if (
        subCategories.some(
          (s: string) =>
            s === "Other" || s === "Main Course:Other" || s === "Sides:Other",
        )
      ) {
        const namedSubs = subCategories.filter(
          (s: string) =>
            s !== "Other" && s !== "Main Course:Other" && s !== "Sides:Other",
        );
        const MAIN_COURSE_SUBCATS = [
          "Tambuli",
          "Sasive",
          "Majjige Huli",
          "Hasi",
          "Sambar",
          "Saaru",
        ];
        const SIDES_SUBCATS = ["Chatni", "Palya", "Kosambari"];

        const isMainCourseOther = subCategories.includes("Main Course:Other");
        const isSidesOther = subCategories.includes("Sides:Other");

        const excludeList = isMainCourseOther
          ? MAIN_COURSE_SUBCATS
          : isSidesOther
            ? SIDES_SUBCATS
            : [...MAIN_COURSE_SUBCATS, ...SIDES_SUBCATS];
        const otherCondition: Record<string, unknown> = {
          subCategory: { $nin: [...excludeList, null, ""], $exists: true },
        };

        if (isMainCourseOther) {
          otherCondition.category = "Main Course";
        } else if (isSidesOther) {
          otherCondition.category = "Sides";
        }

        if (namedSubs.length > 0) {
          andConditions.push({
            $or: [{ subCategory: { $in: namedSubs } }, otherCondition],
          });
        } else {
          andConditions.push(otherCondition);
        }
      } else {
        andConditions.push({ subCategory: { $in: subCategories } });
      }
    }

    // filter by difficulties
    if (difficulties.length > 0) {
      andConditions.push({ difficulty: { $in: difficulties } });
    }

    // filter by max time
    if (maxTime) {
      andConditions.push({ timeNeeded: { $lte: Number(maxTime) } });
    }

    // ONLY SHOW APPROVED RECIPES
    andConditions.push({ status: "approved" });

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    const recipes = await Recipe.find(query)
      .select(
        "_id title description image category subCategory difficulty timeNeeded servings isFavorite status createdBy",
      )
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Get recipes error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
