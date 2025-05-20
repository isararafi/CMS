const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/register", authController.register);

// Login routes for different roles
router.post("/login/student", authController.login("student"));
router.post("/login/tutor", authController.login("tutor"));
router.post("/login/admin", authController.login("admin"));
//check 

module.exports = router;
