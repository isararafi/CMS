const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

// Create first admin (this route should be disabled after first admin is created)
router.post("/create-admin", authController.createAdmin);

// Register new users (requires admin authentication)
router.post("/register", auth, isAdmin, authController.register);

// Login routes for different roles
router.post("/login/student", authController.login("student"));
router.post("/login/tutor", authController.login("tutor"));
router.post("/login/admin", authController.login("admin"));


module.exports = router;
