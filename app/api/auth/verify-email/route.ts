import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    redirect("/screens/sign-in?error=invalid-token");
  }

  await connectDB();

  const user = await User.findOne({
    emailVerifyToken: token,
    emailVerifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    redirect("/screens/sign-in?error=invalid-token");
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyTokenExpiry = undefined;
  await user.save();

  redirect("/screens/sign-in?verified=true");
}
