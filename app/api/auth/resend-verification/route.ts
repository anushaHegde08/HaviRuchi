import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerifyToken = emailVerifyToken;
    user.emailVerifyTokenExpiry = emailVerifyTokenExpiry;
    await user.save();

    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${emailVerifyToken}`;

    await resend.emails.send({
      from: "HaviRuchi <onboarding@resend.dev>",
      to: email,
      subject: "Verify your HaviRuchi account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e85d4a;">Welcome to HaviRuchi!</h2>
          <p>Please verify your email address by clicking the button below.</p>
          <a href="${verifyUrl}"
            style="display: inline-block; background: #e85d4a; color: white;
                   padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
