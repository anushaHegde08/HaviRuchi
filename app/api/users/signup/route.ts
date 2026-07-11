import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// validation schema
const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // validate incoming data
    const result = SignUpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password, phone } = result.data;

    await connectDB();

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 },
      );
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // create user in DB
    await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || undefined,
      provider: "credentials",
      emailVerifyToken,
      emailVerifyTokenExpiry,
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${emailVerifyToken}`;

    await resend.emails.send({
      from: "HaviRuchi <noreply@haviruchi.com>",
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

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
