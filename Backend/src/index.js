require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const port = process.env.PORT || 5000;

const db = require("./db");
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

db();
// Allow CORS for only http://localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Admin routes
app.use('/api/admin', adminRoutes);

// Teacher routes
app.use('/api/teacher', teacherRoutes);

// Student routes
app.use('/api/student', studentRoutes);


app.listen(port, () => {
  console.log("server started...");
});
// module.exports = app;