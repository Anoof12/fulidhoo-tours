import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/auth";
import { hasAdminPanelAccess } from "@/lib/roles";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasAdminPanelAccess(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, and WebP are allowed." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File size must be less than 5MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "fulidhoo-excursions",
              resource_type: "image",
              transformation: [
                { width: 1200, height: 800, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
              ],
            },
            (error, response) => {
              if (error || !response) {
                reject(error ?? new Error("Upload failed"));
                return;
              }
              resolve(response as { secure_url: string; public_id: string });
            },
          )
          .end(buffer);
      },
    );

    return NextResponse.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
