import cloudinaryModule from "cloudinary";

// Prefer the v2 API surface
const cloudinary = (cloudinaryModule as any).v2 || (cloudinaryModule as any);

// Configure primary client from environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const hasSecondary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME_2 &&
    process.env.CLOUDINARY_API_KEY_2 &&
    process.env.CLOUDINARY_API_SECRET_2
);

function getConfigForAccount(account: "primary" | "secondary") {
  if (account === "primary") {
    return {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
  }
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_2,
    api_key: process.env.CLOUDINARY_API_KEY_2,
    api_secret: process.env.CLOUDINARY_API_SECRET_2,
  };
}

/**
 * Upload a buffer or data URI to a specific Cloudinary account.
 * This temporarily reconfigures the shared `cloudinary` client, calls upload, and restores the previous config.
 * NOTE: This approach avoids requiring a newer SDK but is not fully isolated across concurrent requests.
 */
async function uploadToAccount(
  file: Buffer | string,
  opts: { folder?: string; resource_type?: string } = {},
  account: "primary" | "secondary" = "primary"
) {
  if (account === "secondary" && !hasSecondary) {
    throw new Error("Secondary Cloudinary account not configured");
  }

  // Save existing config
  const prevConfig = { ...cloudinary.config() } as any;

  // Apply target account config
  const cfg = getConfigForAccount(account);
  cloudinary.config({ cloud_name: cfg.cloud_name, api_key: cfg.api_key, api_secret: cfg.api_secret });

  try {
    const uploadOptions: any = { resource_type: opts.resource_type || "image" };
    if (opts.folder) uploadOptions.folder = opts.folder;

    // Support Buffer or data URI / base64 string
    if (Buffer.isBuffer(file)) {
      return await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (err: any, result: any) => {
          if (err) return reject(err);
          resolve(result);
        });
        stream.end(file);
      });
    }

    // If string, pass directly (data URI or remote URL)
    return await cloudinary.uploader.upload(file as string, uploadOptions);
  } finally {
    // Restore previous config
    try {
      cloudinary.config({
        cloud_name: prevConfig.cloud_name,
        api_key: prevConfig.api_key,
        api_secret: prevConfig.api_secret,
      });
    } catch (e) {
      console.warn("Failed to restore Cloudinary config:", e);
    }
  }
}

export default cloudinary;
export { uploadToAccount, hasSecondary };
