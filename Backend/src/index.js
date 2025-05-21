require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

const db = require("./db");
const authRoutes = require("./routes/authRoutes");

db();
// Allow CORS for only http://localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log("server started...");
});
