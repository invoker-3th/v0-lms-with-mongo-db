# Updates: Gift Card Submission, Emailing, and Validations

Date: 2026-02-11

Summary
- Added server endpoint for talent gift-card submissions.
- Admin notification emails now include a Cloudinary preview link plus a small attached thumbnail; director notifications exclude the image.
- Implemented server-side validations: rate limiting, jobId sanitization, image MIME/type check, and image size cap (5MB).
- Added client UI for talents to submit gift cards (base64 image + mime).

Files & APIs
- `app/api/talent/submit-gift-card/route.ts` (POST)
  - Purpose: Accept gift card submissions from authenticated TALENT users.
  - Request JSON: `{ method: 'APPLE'|'RAZAR'|'STEAM', code: string, imageBase64?: string, imageMime?: string, jobId?: string }`
  - Server behavior:
    - Authenticates user via `auth()`.
    - Rate limits per-user: max 5 submissions per 1 hour window (in-memory).
    - Validates `method` is one of the accepted types.
    - Validates `jobId` format (24-hex) if provided.
    - Validates `imageMime` starts with `image/` and decoded base64 size <= 5MB.
    - Creates an `AuditLog` entry recording the submission (masked code).
    - Emails admins (from `ADMIN_ACCOUNTS` or `EMAIL_SERVER_USER`) with the submission details, a Cloudinary preview, and a small thumbnail attachment (if provided).
    - Emails the job's director (if `jobId` provided) with submission details but WITHOUT the image.

- `app/api/talent/submit-payment/route.ts` (existing) updated earlier to email admins on ETH/BTC submissions.

- `lib/email.ts`
  - `sendEmail` accepts `to` as `string | string[]` and uses Resend (if available) to send messages.

- `app/talent/submit-gift-card/page.tsx`
  - Client UI for talents to select a method, enter code, optionally upload image and jobId, preview image, and submit to server.
  - Submits image as base64 and `imageMime`.

Security & Limits
- Rate limiting: simple in-memory buckets (resets on process restart). For production, replace with Redis or persistent store.
- Image size: capped at 5MB decoded bytes. Client also enforces an upload preview size check.
- Image handling: images are uploaded to Cloudinary and referenced via secure URLs; admin emails include a preview plus a small thumbnail attachment, while director emails exclude images.
- Cloudinary multi-account note: if you need a truly isolated secondary client, upgrade the `cloudinary` SDK to a version that exports the `Cloudinary` constructor and set the `_2` credentials; otherwise the fallback uses the primary client config.
- jobId is validated for correct ObjectId format; further checks fetch the Job to ensure it exists before notifying the director.
Admin Email Images (Cloudinary)
- Admin emails include a Cloudinary preview (scaled for email) and a small attached thumbnail for quick viewing offline.
- Full-resolution images remain hosted in Cloudinary via `secure_url`.
Testing and Next Steps
- Run the app locally and submit test gift cards. Ensure `RESEND_API_KEY` is configured and `ADMIN_ACCOUNTS` contains valid admin email(s).
- Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set in `.env.local`.
Contact
- Support email used in code: `EMAIL_SERVER_USER` / `ADMIN_ACCOUNTS` per `.env.local`.

What You Need To Do Next
- Verify `ADMIN_ACCOUNTS`, `RESEND_API_KEY`, and Cloudinary credentials in `.env.local`.
- Submit a test gift-card with an image and confirm the admin email includes a thumbnail attachment and a preview image.
- Decide whether to keep the 5MB image cap or tighten it for production.

