import { NextResponse } from "next/server";
import cloudinary, { secondaryCloudinary } from "@/lib/cloudinary";

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

    // Upload to primary Cloudinary
    const uploadPrimary = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: isVideo ? "video" : isDocument ? "raw" : "image",
            folder: "hubmovies",
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

    // Upload to secondary Cloudinary (if configured)
    const uploadSecondary = () =>
      new Promise(async (resolve, reject) => {
        if (!secondaryCloudinary) return resolve(null);
        try {
          const uploadStream = secondaryCloudinary.uploader.upload_stream(
            {
              resource_type: isVideo ? "video" : isDocument ? "raw" : "image",
              folder: "hubmovies",
            },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        } catch (err) {
          // Don't fail overall if secondary upload fails
          console.error("Secondary Cloudinary upload failed:", err);
          resolve(null);
        }
      });

    const primaryResult = await uploadPrimary();
    let secondaryResult: any = null;
    try {
      secondaryResult = await uploadSecondary();
    } catch (err) {
      // swallow secondary errors
      secondaryResult = null;
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

