# Email Server Setup Guide

This guide will help you set up email functionality for HubMovies Cast, which is required for:
- User verification emails
- Password reset emails
- Application status notifications
- Message notifications

## Option 1: Gmail (Recommended for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "HubMovies Cast" as the name
4. Click "Generate"
5. Copy the 16-character password (you'll use this in `.env.local`)

### Step 3: Update `.env.local`
Add these values to your `.env.local` file:

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-16-character-app-password
EMAIL_FROM=noreply@hubmovies.com
```

**Important:** Use the App Password, NOT your regular Gmail password.

## Option 2: Resend API (Recommended for Production)

Resend is a modern email API service.

### Step 1: Sign Up for Resend
1. Go to: https://resend.com
2. Sign up for a free account
3. Verify your domain (or use their test domain for development)

### Step 2: Get API Key
1. Go to API Keys section
2. Create a new API key
3. Copy the API key

### Step 3: Update `.env.local`
```env
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

**Note:** The codebase currently uses nodemailer. To use Resend, you'll need to update `lib/email.ts` to use Resend SDK instead.

## Option 3: Other SMTP Providers

### Outlook/Hotmail
```env
EMAIL_SERVER_HOST=smtp-mail.outlook.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@outlook.com
EMAIL_SERVER_PASSWORD=your-password
```

### SendGrid
1. Sign up at https://sendgrid.com
2. Create an API key
3. Use SMTP settings:
```env
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
```

### Mailgun
1. Sign up at https://mailgun.com
2. Get SMTP credentials:
```env
EMAIL_SERVER_HOST=smtp.mailgun.org
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-mailgun-username
EMAIL_SERVER_PASSWORD=your-mailgun-password
```

## Testing Email Configuration

After setting up your email server, test it by:

1. **Starting the dev server:**
   ```bash
   npm run dev
   ```

2. **Try signing up:**
   - Go to `/signup`
   - Enter an email address
   - You should receive a verification email

3. **Check for errors:**
   - Check the terminal/console for email sending errors
   - Check your spam folder if email doesn't arrive

## Troubleshooting

### "Failed to send verification email" Error

**Common causes:**
1. **Wrong credentials:** Double-check your email and password in `.env.local`
2. **App Password not used (Gmail):** Make sure you're using an App Password, not your regular password
3. **2FA not enabled (Gmail):** App passwords require 2FA to be enabled
4. **Firewall/Network:** Some networks block SMTP ports
5. **Provider restrictions:** Some email providers block SMTP from unknown locations

### Gmail Specific Issues

- **"Less secure app access":** Gmail no longer supports this. You MUST use App Passwords.
- **"Access blocked":** Google may block sign-ins from new locations. Check your Google Account security alerts.

### Development Workaround

For development/testing without email setup, you can:
1. Check the terminal logs for the verification link
2. Manually create users in the database
3. Use a service like Mailtrap (https://mailtrap.io) for testing

## Production Recommendations

For production, we recommend:
1. **Resend** - Modern, reliable, good free tier
2. **SendGrid** - Enterprise-grade, generous free tier
3. **AWS SES** - Cost-effective at scale
4. **Mailgun** - Developer-friendly

All of these provide better deliverability and analytics than basic SMTP.

## Current Implementation

The app uses `nodemailer` for email sending. The configuration is in:
- `lib/email.ts` - Email sending functions
- `app/api/auth/[...nextauth]/route.ts` - NextAuth email provider configuration

Make sure your `.env.local` file has all required email variables before testing signup functionality.

