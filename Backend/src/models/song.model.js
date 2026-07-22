const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Song title is required"],
      trim: true,
    },

    artist: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },

    audio: {
      type: String,
      required: [true, "Audio URL is required"],
    },

    mood: {
      type: String,
      required: [true, "Mood is required"],
      enum: ["happy", "sad", "relaxed", "energetic"],
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema);

module.exports = Song;