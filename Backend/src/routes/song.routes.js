const express = require("express");
const multer = require("multer");

const Song = require("../models/song.model");
const uploadFile = require("../service/storage.service");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 15 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("audio/")) {
      callback(new Error("Only audio files are allowed"));
      return;
    }

    callback(null, true);
  },
});

// POST /api/songs
router.post(
  "/songs",
  upload.single("audio"),
  async (req, res) => {
    try {
      const { title, artist, mood } = req.body;

      if (!title || !artist || !mood) {
        return res.status(400).json({
          success: false,
          message: "Title, artist and mood are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Audio file is required",
        });
      }

      const fileData = await uploadFile(req.file);

      const song = await Song.create({
        title,
        artist,
        mood: mood.toLowerCase(),
        audio: fileData.url,
      });

      return res.status(201).json({
        success: true,
        message: "Song uploaded successfully",
        song,
      });
    } catch (error) {
      console.error("Song upload error:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message || "Unable to upload song",
      });
    }
  }
);

// GET /api/songs
router.get("/songs", async (req, res) => {
  try {
    const mood = req.query.mood?.toLowerCase();

    const filter = mood ? { mood } : {};

    const songs = await Song.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: songs.length,
      songs,
    });
  } catch (error) {
    console.error("Fetch songs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch songs",
    });
  }
});

module.exports = router;