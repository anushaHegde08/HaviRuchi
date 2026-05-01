import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  console.log("GET profile called");
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    console.log("user from DB:", user.image, user.phone);
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

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...(image && { image }), // only update if provided
        ...(phone && { phone }), // only update if provided
      },
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
