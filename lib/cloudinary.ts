import cloudinaryModule from "cloudinary";

const { v2: cloudinary, Cloudinary } = cloudinaryModule as any;

// Primary (default) Cloudinary client
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Secondary Cloudinary client (optional)
let secondaryCloudinary: any = null;
if (process.env.CLOUDINARY_CLOUD_NAME_2 && process.env.CLOUDINARY_API_KEY_2 && process.env.CLOUDINARY_API_SECRET_2) {
  try {
    secondaryCloudinary = new Cloudinary({
      cloud: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME_2,
        api_key: process.env.CLOUDINARY_API_KEY_2,
        api_secret: process.env.CLOUDINARY_API_SECRET_2,
      },
    });
  } catch (err) {
    console.error("Failed to initialize secondary Cloudinary client:", err);
    secondaryCloudinary = null;
  }
}

export default cloudinary;
export { secondaryCloudinary };
