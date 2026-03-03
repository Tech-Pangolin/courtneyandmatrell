## The Curtain Rises – Architecture & Configuration

This document captures the core technical architecture and external configuration for the project.

### 1. Stack Overview

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS (v4) via `@tailwindcss/postcss`
- **Database**: MongoDB Atlas (via Mongoose)
- **Auth**: JWT (HttpOnly secure cookies)
- **Email**: Provider TBD (Resend / Postmark / SendGrid)
- **Rich Text**: TipTap (for guest messages and admin email editor)
- **Animation**: GSAP + HTML5 Canvas for the curtain shimmer intro
- **External Integration**: Google Sheets API (service account) for mirroring registered guests

---

### 2. Environment Variables

These will be read from `.env.local` (for local development) and from the host platform’s environment in production.

#### 2.1 Core Secrets

- `MONGODB_URI` – MongoDB Atlas connection string, including username/password and database.
- `MONGODB_DB_NAME` – Logical database name (e.g. `the_curtain_rises`).
- `INVITE_ACCESS_CODE` – 3–digit invite code (e.g. `482`). **Never exposed on the frontend.**

#### 2.2 Email Provider (Example)

Depending on the chosen provider (not yet finalized):

- `RESEND_API_KEY` **or** `SENDGRID_API_KEY` **or** `POSTMARK_SERVER_TOKEN`
- `EMAIL_FROM` – Default “from” address (e.g. `The Curtain Rises <no-reply@yourdomain.com>`).

#### 2.3 Google Sheets (Guest Sync)

From the Google Cloud service account JSON and the target sheet:

- `GOOGLE_SHEETS_PROJECT_ID`
- `GOOGLE_SHEETS_CLIENT_EMAIL`
- `GOOGLE_SHEETS_PRIVATE_KEY`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_GUESTS_RANGE` – e.g. `Guests!A:J`

The app will use these to append or update guest rows on successful registration.

---

### 3. MongoDB Atlas Configuration (Summary)

1. **Create Cluster**
   - Use MongoDB Atlas UI to create a cluster for this project.
2. **Create Database User**
   - Example: `wedding_app` with a strong password.
3. **Network Access**
   - Allow connections from your development IP or from `0.0.0.0/0` (for testing only).
4. **Connection String**
   - Use Atlas’s “Connect → Drivers” wizard to copy the connection string.
   - Example:

     ```text
     MONGODB_URI=mongodb+srv://wedding_app:YOUR_PASSWORD@cluster0.abcd123.mongodb.net/the_curtain_rises
     ```

5. **Database Name**
   - Use a dedicated DB name, e.g. `the_curtain_rises`.

---

### 4. Google Cloud & Sheets Configuration (Step‑by‑Step)

#### 4.1 Create Google Cloud Project

1. Go to `https://console.cloud.google.com/` and sign in.
2. Create a new project (e.g. `the-curtain-rises-wedding`).
3. Switch to that project in the top project selector.

#### 4.2 Enable Google Sheets API

1. Navigate to **APIs & Services → Library**.
2. Search for **Google Sheets API**.
3. Click **Enable**.

#### 4.3 Create Service Account

1. Go to **IAM & Admin → Service Accounts**.
2. Click **Create Service Account**.
3. Name: `wedding-sheets-sync` (or similar).
4. Click **Create and continue**, then **Done** (no extra roles required for Sheets).

#### 4.4 Create Service Account Key

1. Open the new service account → **Keys** tab.
2. **Add key → Create new key → JSON**.
3. Download the JSON file and store it securely.
4. Extract:
   - `project_id`
   - `client_email`
   - `private_key`

Set the following env vars:

```text
GOOGLE_SHEETS_PROJECT_ID=<project_id_from_json>
GOOGLE_SHEETS_CLIENT_EMAIL=<client_email_from_json>
GOOGLE_SHEETS_PRIVATE_KEY=<private_key_from_json>
```

Note: When pasting `GOOGLE_SHEETS_PRIVATE_KEY` into an environment variable, you may need to replace real newlines with `\n`. The app will normalize this.

#### 4.5 Configure the Target Sheet

1. Create a new Google Sheet (e.g. “The Curtain Rises – Guests”).
2. Copy its **spreadsheet ID** from the URL:

   ```text
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
   ```

   Use:

   ```text
   GOOGLE_SHEETS_SPREADSHEET_ID=SPREADSHEET_ID
   ```

3. Rename the first tab to `Guests`.
4. In row 1, create headers:
   - `A1`: `Timestamp Created`
   - `B1`: `First Name`
   - `C1`: `Last Name`
   - `D1`: `Email`
   - `E1`: `RSVP Status`
   - `F1`: `Guest Count`
   - `G1`: `Meal Preference`
   - `H1`: `Invite Verified`
   - `I1`: `Email Verified`
   - `J1`: `Last Updated`

5. Set:

   ```text
   GOOGLE_SHEETS_GUESTS_RANGE=Guests!A:J
   ```

6. Share the sheet with the **service account email** from the JSON (`...@PROJECT_ID.iam.gserviceaccount.com`) and give it **Editor** access.

---

### 5. High‑Level Application Structure

- `app/layout.tsx` – Root layout, fonts, global background, and Art Deco base styling.
- `app/page.tsx` – Home page hero, curtain intro, invite code + registration entry point, gallery, and high‑level content.
- `app/api/verify-code/route.ts` – Secure invite code verification (constant‑time compare, rate limiting).
- `app/api/register/route.ts` – Registration endpoint: creates users in MongoDB and triggers Google Sheets sync.
- `lib/mongodb.ts` – MongoDB connection helper (Mongoose).
- `lib/googleSheets.ts` – Google Sheets sync helper (called by registration logic).
- `models/User.ts` – User schema and model.
- `models/Message.ts` – Guest message schema and model (for the message wall).
- `models/Settings.ts` – Global settings (venue info, venmo handle, etc.).
- `components/CurtainIntro.tsx` – Canvas‑based curtain + shimmer intro overlay with GSAP.
- `components/InviteCodeForm.tsx` – 3‑digit invite code UI with elegant error feedback.
- `components/RegistrationForm.tsx` – Guest registration UI (fields, RSVP, etc.).

This file will be kept in sync with major architectural decisions so you always have a concise reference for infrastructure and configuration.

