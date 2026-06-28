const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // Add your Vercel frontend URL here after deployment
      // "https://your-frontend.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Inflingo Backend is Live!");
});

// API Routes
app.use("/api/notices", require("./routes/notices"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cr", require("./routes/crrequest"));

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});