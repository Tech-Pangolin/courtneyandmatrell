import { google } from "googleapis";

const sheetsScopes = ["https://www.googleapis.com/auth/spreadsheets"];

function normalizePrivateKey(key: string | undefined) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

export async function appendGuestToSheet(row: (string | number | boolean | null)[]) {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY);
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const guestsRange = process.env.GOOGLE_SHEETS_GUESTS_RANGE || "Guests!A:J";

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.warn("[Sheets] Missing configuration; guest row not written.");
    return;
  }

  const jwt = new google.auth.JWT(clientEmail, undefined, privateKey, sheetsScopes);
  const sheets = google.sheets({ version: "v4", auth: jwt });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: guestsRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
  } catch (err) {
    console.error("[Sheets] Error appending guest row", err);
  }
}

