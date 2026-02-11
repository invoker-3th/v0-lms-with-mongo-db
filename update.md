# Updates: Gift Card Submission, Emailing, and Validations

Date: 2026-02-11

Summary
- Added server endpoint for talent gift-card submissions.
- Admin notification emails now include the submitted image; director notifications exclude the image.
- Implemented server-side validations: rate limiting, jobId sanitization, image MIME/type check, and image size cap (2MB).
- Added client UI for talents to submit gift cards (base64 image + mime).

Files & APIs
- `app/api/talent/submit-gift-card/route.ts` (POST)
  - Purpose: Accept gift card submissions from authenticated TALENT users.
  - Request JSON: `{ method: 'APPLE'|'RAZOR'|'STEAM', code: string, imageBase64?: string, imageMime?: string, jobId?: string }`
  - Server behavior:
    - Authenticates user via `auth()`.
    - Rate limits per-user: max 5 submissions per 1 hour window (in-memory).
    - Validates `method` is one of the accepted types.
    - Validates `jobId` format (24-hex) if provided.
    - Validates `imageMime` starts with `image/` and decoded base64 size <= 5MB.
    - Creates an `AuditLog` entry recording the submission (masked code).
    - Emails admins (from `ADMIN_ACCOUNTS` or `EMAIL_SERVER_USER`) with the submission details and the image embedded as a data URI (if provided).
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
- Image handling: images are not stored in Cloudinary or DB; they are embedded into the admin email as data URIs and therefore transit via the email provider. Consider replacing this with secure temporary storage (S3/Cloudinary with restricted access) if retention or large attachments are needed.
- jobId is validated for correct ObjectId format; further checks fetch the Job to ensure it exists before notifying the director.

Testing and Next Steps
- Run the app locally and submit test gift cards. Ensure `RESEND_API_KEY` or email provider is configured and `ADMIN_ACCOUNTS` contains valid admin email(s).
- Replace in-memory rate limiter with a Redis-backed limiter for multiple-instance deployments.
- Add server-side virus/scan of uploaded images if you accept user-supplied binaries in production.

Contact
- Support email used in code: `EMAIL_SERVER_USER` / `ADMIN_ACCOUNTS` per `.env.local`.
