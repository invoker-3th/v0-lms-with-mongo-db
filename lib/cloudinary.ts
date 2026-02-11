import cloudinaryModule from "cloudinary";

// Prefer the v2 API surface
const cloudinary = (cloudinaryModule as any).v2 || (cloudinaryModule as any);

// Primary (default) Cloudinary client
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Secondary Cloudinary client (optional)
let secondaryCloudinary: any = null;
if (
  process.env.CLOUDINARY_CLOUD_NAME_2 &&
  process.env.CLOUDINARY_API_KEY_2 &&
  process.env.CLOUDINARY_API_SECRET_2
) {
  try {
    // Try to locate a Cloudinary constructor; different package versions export differently.
    const CloudinaryConstructor = (cloudinaryModule as any).Cloudinary || (cloudinaryModule as any).v2?.Cloudinary || null;
    if (CloudinaryConstructor && typeof CloudinaryConstructor === "function") {
      secondaryCloudinary = new CloudinaryConstructor({
        cloud: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME_2,
          api_key: process.env.CLOUDINARY_API_KEY_2,
          api_secret: process.env.CLOUDINARY_API_SECRET_2,
        },
      });
    } else {
      // Fallback: create a lightweight wrapper that points to the v2 API but marks it as secondary.
      // This avoids throwing when a constructor is not available in the installed cloudinary package.
      console.warn("Cloudinary secondary constructor not available; using v2 client with separate config object (non-isolated). To fully isolate accounts, update the Cloudinary SDK.");
      secondaryCloudinary = cloudinary; // non-isolated fallback
    }
  } catch (err) {
    console.error("Failed to initialize secondary Cloudinary client:", err);
    secondaryCloudinary = null;
  }
}

export default cloudinary;
export { secondaryCloudinary };
