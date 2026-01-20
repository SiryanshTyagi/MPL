const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    // basic details
    name: {
      type: String,

      trim: true,
    },
    mobile: {
      type: String,

      unique: true,
    },
    address: {
      type: String,
    },
    age: {
      type: Number,
    },
    aadhar: {
      type: String,

      unique: true,
    },
    regNumber: {
      type: Number,
      unique: true, // Ensures no two players get the same ID
    },

    //Image upload
    photo: {
      type: String,
    },
    screenshot: {
      type: String,
    },

    //imp detail
    category: {
      type: String,

      enum: ["A", "B"],
    },
    registrationFee: {
      type: Number,
    },
    lastSeason: {
      type: String,
      default: "New Player",
    },
    style: {
      type: String,

      enum: ["Batter", "Bowler", "Keeper", "All-Rounder"],
    },
    hand: {
      type: String,

      enum: ["LHS", "RHS"],
    },
  },
  { timestamps: true }
);

// pre save hook for registration fee
playerSchema.pre("save", async function () {
  if (this.category === "A") {
    this.registrationFee = 400;
  } else {
    this.registrationFee = 200;
  }

  if (this.isNew) {
    // Only run for new registrations, not updates
    try {
      // Find the last player registered and sort by regNumber descending
      const lastPlayer = await mongoose
        .model("Player")
        .findOne()
        .sort({ regNumber: -1 });

      // If no players exist, start at 100. Otherwise, increment by 1
      this.regNumber =
        lastPlayer && lastPlayer.regNumber ? lastPlayer.regNumber + 1 : 100;
    } catch (err) {
      console.log("some error occured", err);
    }
  }
});

module.exports = mongoose.model("Player", playerSchema);
