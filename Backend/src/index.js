require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const swaggerDocs = require("./config/swagger");

const port = process.env.PORT || 5000;
// Connect database
db();

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // <-- only this URL is allowed
  credentials: true, // if you want to allow cookies/auth headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Swagger
swaggerDocs(app);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/students', studentRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});