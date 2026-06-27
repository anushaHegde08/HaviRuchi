import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("API PROFILE GET - session.user.email:", session?.user?.email);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { image, phone } = body;

    const updateData: Record<string, string> = {};
    if (image !== undefined) {
      updateData.image = image;
      // if clearing the image, delete from Cloudinary
      if (image === "") {
        const user = await User.findOne({ email: session.user.email });
        if (user?.image && user.image.includes("cloudinary")) {
          const publicId = user.image.split("/").pop()?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`haviruchi/profiles/${publicId}`);
          }
        }
      }
    }
    if (phone !== undefined) {
      updateData.phone = phone;
    }

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }, // return updated document
    );

    return NextResponse.json({
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      phone: updatedUser.phone,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
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

    // delete all recipes by user
    await Recipe.deleteMany({ createdBy: user._id });

    // remove user from others' favorites
    await User.updateMany(
      {
        favorites: {
          $in: await Recipe.find({ createdBy: user._id }).distinct("_id"),
        },
      },
      {
        $pull: {
          favorites: {
            $in: await Recipe.find({ createdBy: user._id }).distinct("_id"),
          },
        },
      },
    );

    // delete profile image from Cloudinary if exists
    if (user.image && user.image.includes("cloudinary")) {
      const publicId = user.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`haviruchi/profiles/${publicId}`);
      }
    }

    // delete user
    await User.findOneAndDelete({ email: session.user.email });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
