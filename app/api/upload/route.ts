import { NextResponse } from "next/server";
import cloudinary, { uploadToAccount, hasSecondary } from "@/lib/cloudinary";

/**
 * POST /api/upload
 * Uploads a file to Cloudinary
 * 
 * Request body (FormData):
 * - file: File (required) - The file to upload
 * 
 * Returns:
 * - 200: { url: string } - The uploaded file URL
 * - 400: Missing file or invalid file type
 * - 500: Upload failed
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    const isVideo = fileType.startsWith("video/");
    const isImage = fileType.startsWith("image/");
    const isDocument = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(fileType);

    if (!isVideo && !isImage && !isDocument) {
      return NextResponse.json(
        { error: "Invalid file type. Only images, videos and documents (PDF/DOC) are allowed." },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to primary Cloudinary using helper
    const primaryResult = await uploadToAccount(buffer, { resource_type: isVideo ? "video" : isDocument ? "raw" : "image", folder: "hubmovies" }, "primary");
    let secondaryResult: any = null;
    if (hasSecondary) {
      try {
        secondaryResult = await uploadToAccount(buffer, { resource_type: isVideo ? "video" : isDocument ? "raw" : "image", folder: "hubmovies" }, "secondary");
      } catch (err) {
        console.error("Secondary Cloudinary upload failed:", err);
        secondaryResult = null;
      }
    }

    const url = (primaryResult as any)?.secure_url || null;
    const secondaryUrl = (secondaryResult as any)?.secure_url || null;

    return NextResponse.json({ url, secondaryUrl });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

