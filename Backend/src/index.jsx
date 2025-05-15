const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const db = require("./db");
// const http = require("https");
db();
// app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { name, email } = req.body;
  const newuser = { id: 1, name, email };
  res.status(201).json({
    success: true,
    message: "coorect", 
    data: newuser,
  });
});

app.listen(port, () => {
  console.log("server started...");
});
