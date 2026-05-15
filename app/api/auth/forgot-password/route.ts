import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("Resend API key exists:", !!process.env.RESEND_API_KEY);
    console.log("Sending to:", email);
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    // don't reveal if user exists — security
    if (!user) {
      return NextResponse.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // save to DB
    await User.findOneAndUpdate({ email }, { resetToken, resetTokenExpiry });

    // send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/screens/reset-password?token=${resetToken}`;

    const result = await resend.emails.send({
      from: "HaviRuchi <onboarding@resend.dev>",
      to: email,
      subject: "Reset your HaviRuchi password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e85d4a;">Reset Your Password</h2>
          <p>You requested a password reset for your HaviRuchi account.</p>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}"
            style="display: inline-block; background: #e85d4a; color: white;
                   padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    console.log("Resend result:", result);
    return NextResponse.json({
      message: "If this email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
