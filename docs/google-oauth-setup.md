# Phase 5: Google OAuth Setup Guide

## Prerequisites
- Google Account
- KORTEX backend & frontend running

---

## Step 1: Google Cloud Console Setup (5 minutes)

### 1.1 Create Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on project dropdown (top left) → **New Project**
3. Project name: `KORTEX`
4. Click **Create**
5. Wait for project creation, then select it

### 1.2 Create OAuth Credentials
1. In the sidebar: **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure consent screen first:
   - User Type: **External** → Create
   - App name: `KORTEX`
   - User support email: (your email)
   - Developer contact: (your email)
   - Click **Save and Continue** (skip scopes, test users)

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `KORTEX Web Client`
   - **Authorized JavaScript origins:**
     - Add URI: `http://localhost:3000`
   - **Authorized redirect URIs:**
     - Add URI: `http://localhost:3000/api/auth/callback/google`
   - Click **Create**

5. **IMPORTANT:** Copy the credentials shown:
   - `Client ID` (looks like: `xxxxx.apps.googleusercontent.com`)
   - `Client Secret` (random string)

---

## Step 2: Configure Frontend Environment

1. Create `frontend/.env.local` file:
```bash
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=run_this_command_to_generate
NEXTAUTH_URL=http://localhost:3000
```

2. Generate `NEXTAUTH_SECRET`:
```bash
# In Git Bash or WSL
openssl rand -base64 32

# Or in PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

3. Paste the generated secret into `NEXTAUTH_SECRET`

---

## Step 3: Restart Frontend
After creating `.env.local`, restart the Next.js dev server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## ✅ You're Ready!

Once you've completed these steps:
- OAuth credentials are configured
- Environment variables are set
- Frontend is restarted

The authentication system will be functional!

---

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Check that redirect URI in Google Console EXACTLY matches:
  `http://localhost:3000/api/auth/callback/google`
- No trailing slash, correct port number

**Error: "Invalid client"**
- Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Make sure no extra spaces or quotes

**Can't access Google Console**
- Make sure you're signed in with your Google account
- Try incognito mode if you have multiple accounts
