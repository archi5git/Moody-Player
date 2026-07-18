const express = require('express');
const multer =require('multer');
const uploadFile = require('../service/storage.service');
const router = express.Router();
const upload = multer({storage:multer.memoryStorage()});
const songModel = require("../models/song.model")

router.post('/songs', upload.single("audio"), async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Audio file missing" });
    }

    if (req.file.size === 0) {
      return res.status(400).json({ error: "File is empty (size 0)" });
    }

    const fileData = await uploadFile(req.file);
    console.log("ImageKit result:", fileData);

    const song = await songModel.create({
      title: req.body.title,
      author: req.body.author,
      audio: fileData.url,
      mood: req.body.mood,
    });

    res.status(201).json({
      message: "song created successfully",
      song: song,
    });

  } catch (err) {
    console.error("FULL ERROR:", err); // ← terminal mein exact error aayega
    res.status(500).json({ error: err.message });
  }
});

router.get('/songs',async(req,res)=>{
    const mood = req.query.mood;
    const filter = mood ? {mood: mood} :{};
     const songs = await songModel.find(filter);

     res.status(200).json({
        message:"songs fetched successfully",
        songs:songs,
     })
})




module.exports=router;