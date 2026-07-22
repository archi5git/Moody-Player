const express = require("express");
const cors = require("cors");

const songRoutes = require("./routes/song.routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Moody Player API is running",
  });
});

app.use("/api", songRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;