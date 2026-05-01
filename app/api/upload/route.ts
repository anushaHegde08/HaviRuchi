import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "haviruchi";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // validate file size — 5MB max
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    // validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG and WebP images are allowed" },
        { status: 400 },
      );
    }

    // convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: `haviruchi/${folder}`, // haviruchi/recipes or haviruchi/profiles
      transformation: [
        { quality: "auto" }, // auto compress
        { fetch_format: "auto" }, // auto format (webp if supported)
      ],
    });

    return NextResponse.json({
      url: result.secure_url, // HTTPS URL to store in MongoDB
      publicId: result.public_id, // for deleting later
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
