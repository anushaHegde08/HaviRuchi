import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    await connectDB();

    // find user by token and check expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // token not expired
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 },
      );
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password and clear token
    await User.findOneAndUpdate(
      { resetToken: token },
      {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiry: undefined,
      },
    );

    return NextResponse.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
