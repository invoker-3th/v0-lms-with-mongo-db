# Resend Setup — Complete Configuration Guide ✅

Goal: Send transactional emails using Resend with Next.js.

---

## 1) Installation & Dependencies
✅ **Already done:**
- Resend SDK installed: `npm install resend` (v6.9.1)
- SDK integrated in `lib/email.ts`

## 2) Environment Variables Setup
Add to `.env.local` (for local development):
```
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For Production (Vercel):**
- Go to your Vercel project → **Settings → Environment Variables**
- Add the same three variables above
- Redeploy your application

## 3) Get Your API Key
1. Sign up at https://resend.com
2. Go to **API Keys** in the dashboard
3. Create a new API key and copy it
4. Add it to your `.env.local` as `RESEND_API_KEY=re_...`

## 4) Verify Your Domain (Recommended for Production)
1. In Resend Dashboard → **Domains** → **Add Domain**
2. Enter your domain (e.g., `hubmovies-cd.com`)
3. Resend will provide SPF and DKIM records to add to your DNS
4. Add the DNS records in your domain registrar
5. Wait 5-30 minutes for verification (check dashboard for `verified` status)

**Note:** Use a subdomain like `noreply@updates.hubmovies-cd.com` for better deliverability.

## 5) How It Works in This Project
The email system is centralized in `lib/email.ts` with the following functions:

- **`sendEmail()`** - Core function that sends emails via Resend SDK
- **`sendOtpEmail()`** - OTP/sign-in codes (used in `/auth`)
- **`sendVerificationEmail()`** - Email verification for new accounts
- **`sendPasswordResetEmail()`** - Password reset links
- **`sendApplicationStatusEmail()`** - Talent notifications (accepted/rejected)
- **`sendMessageNotificationEmail()`** - New message notifications

All functions return a boolean (true = success, false = failure).

## 6) Testing Locally
1. **UI Test:** Go to `/auth` → request sign-in code → check inbox
2. **Dashboard:** Visit https://resend.com/emails to view all sent emails and their status

## 7) Implementation - Core Function (lib/email.ts)
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@hubmovies-cd.com";

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] Service not configured");
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[Email] Failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Error:", error);
    return false;
  }
}
```

## 8) Usage in API Routes
```typescript
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  
  const success = await sendOtpEmail(email, otp);
  if (!success) {
    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
  
  return Response.json({ success: true });
}
```

## 9) Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Check API key is correct in `.env.local` and dashboard |
| **422 Invalid Sender** | Use a verified domain or email (e.g., `noreply@yourdomain.com`) |
| **429 Too Many Requests** | Hit rate limits. Check your Resend plan limits. |
| **Emails not arriving** | Check Resend dashboard for failure reasons; verify SPF/DKIM if domain verified |
| **Links not working** | Ensure `NEXT_PUBLIC_APP_URL` is set correctly for your environment |

## 10) Best Practices

- ✅ **Use subdomains** for email (e.g., `noreply@updates.hubmovies-cd.com`)
- ✅ **Verify domains** for production (improves deliverability)
- ✅ **Never commit API keys** - use `.env.local` (gitignored)
- ✅ **Check Resend Dashboard** for email logs and delivery status

## 11) Useful Resources

- **Resend Docs:** https://resend.com/docs
- **Next.js Guide:** https://resend.com/docs/send-with-nextjs
- **Domain Verification:** https://resend.com/docs/dashboard/domains/introduction
- **Dashboard:** https://resend.com/emails
