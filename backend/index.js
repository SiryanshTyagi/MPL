const { google } = require("googleapis");
const path = require("path");

// Function to initialize/update headers and format them
async function setupSheetHeaders() {
  try {
    const auth = new google.auth.GoogleAuth({
      // FIX: Use credentials from environment variable instead of keyFile
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_JSON_STRING),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1sIgzD4yrYjJd_RhBqx0Fqrd3iNiYCVDlp8Kh75oemL4";

    const headers = [
      [
        "Reg ID",
        "Player Name",
        "Mobile Number",
        "Category",
        "Fee Paid",
        "Photo Link",
      ],
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1:F1",
      valueInputOption: "USER_ENTERED",
      resource: { values: headers },
    });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  textFormat: { bold: true, fontSize: 11 },
                  horizontalAlignment: "CENTER",
                  verticalAlignment: "MIDDLE",
                  backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
                },
              },
              fields:
                "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,backgroundColor)",
            },
          },
        ],
      },
    });
    console.log("✅ Headers updated and formatted successfully!");
  } catch (error) {
    // This will now catch JSON parsing errors or API permission issues instead of missing files
    console.error("❌ Header setup error:", error);
  }
}
async function syncToSheets(playerData) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_JSON_STRING),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1sIgzD4yrYjJd_RhBqx0Fqrd3iNiYCVDlp8Kh75oemL4";

    const values = [
      [
        playerData.regNumber,
        playerData.name,
        playerData.mobile,
        playerData.category,
        playerData.registrationFee,
        playerData.photo,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    // Enhancement for row data: Centering and Borders
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: { sheetId: 0, startRowIndex: 1 }, // Apply to all rows except header
              cell: {
                userEnteredFormat: {
                  horizontalAlignment: "CENTER",
                  verticalAlignment: "MIDDLE",
                  borders: {
                    top: { style: "SOLID" },
                    bottom: { style: "SOLID" },
                    left: { style: "SOLID" },
                    right: { style: "SOLID" },
                  },
                },
              },
              fields:
                "userEnteredFormat(horizontalAlignment,verticalAlignment,borders)",
            },
          },
        ],
      },
    });

    console.log("✅ Data successfully synced and formatted!");
  } catch (error) {
    console.error("❌ Google Sheets Error:", error);
  }
}

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Player = require("./models/Players");
const { storage } = require("./cloudinaryConfig.js");
const multer = require("multer");
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
const app = express();

// Helper to normalize uploaded file objects to a usable URL string
function getFileUrl(file) {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (file.secure_url) return file.secure_url;
  if (file.url) return file.url;
  if (file.path) return file.path;
  // Multer file may have a `location` or `filename` depending on storage
  if (file.location) return file.location;
  return null;
}

// 1. Dynamic CORS: Once deployed, replace '*' with your actual frontend URL
app.use(
  cors({
    origin: "https://mpl-eta.vercel.app", // Use your EXACT current Vercel URL
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

mongoose
  .connect(MONGODB_URL)
  .then(async () => {
    console.log("Connected to MongoDB Atlas successfully");
    await setupSheetHeaders();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Deployment Connection Error:", err);
    process.exit(1);
  });

// --- ROUTES ---

app.post(
  "/mpl/registration",
  upload.fields([{ name: "photo" }, { name: "screenshot" }]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.photo || !req.files.screenshot) {
        return res
          .status(400)
          .json({ message: "Both photo and screenshot are required" });
      }

      // Normalize uploaded file objects to string URLs (prefer secure_url)
      const photo = getFileUrl(req.files.photo[0]);
      const screenshot = getFileUrl(req.files.screenshot[0]);

      // Log for debugging (remove or lower verbosity in production)
      console.log("Upload files resolved to:", { photo, screenshot });

      const newPlayer = new Player({
        name: req.body.name,
        mobile: req.body.mobile,
        age: req.body.age,
        aadhar: req.body.aadhar,
        address: req.body.address,
        category: req.body.category,
        style: req.body.style,
        hand: req.body.hand,
        // store string URLs so frontend gets consistent values
        photo: photo,
        screenshot: screenshot,
      });

      const savedPlayer = await newPlayer.save();

      // SYNC TO SHEETS
      await syncToSheets(savedPlayer);

      res.json({
        message: "Registration successful",
        regNumber: savedPlayer.regNumber,
      });
    } catch (err) {
      console.error("Save failed:", err);
      res
        .status(500)
        .json({ message: "Error saving registration", error: err.message });
    }
  },
);

app.get("/mpl/players", async (req, res) => {
  try {
    let players = await Player.find().sort({ createdAt: -1 });

    // Ensure response fields are plain JSON with string URLs when possible
    const normalized = players.map((p) => {
      const obj = p.toObject();
      obj.photo = getFileUrl(obj.photo) || null;
      obj.screenshot = getFileUrl(obj.screenshot) || null;
      return obj;
    });

    res.json(normalized);
  } catch (err) {
    res.status(400).json({ message: "Error fetching players" });
  }
});

app.get("/", (req, res) => {
  res.send("MPL Backend Root");
});
