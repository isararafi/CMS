const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// REGISTER (Admin only for creating students and tutors)
exports.register = async (req, res) => {
  const { username, email, password, role, batch, regNo, department } = req.body;
  
  try {
    // Basic validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: { details: "Please fill all required fields" }
      });
    }

    // Validate role
    if (!["student", "tutor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: { details: "Invalid role. Can only create student or tutor accounts" }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        error: { details: "User already exists" }
      });
    }

    // Validate student-specific fields
    if (role === "student") {
      if (!batch || !regNo || !department) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: { details: "Batch, registration number, and department are required for students" }
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with role-specific fields
    const userData = {
      username,
      email,
      password: hashedPassword,
      role
    };

    // Add student-specific fields if role is student
    if (role === "student") {
      Object.assign(userData, { batch, regNo, department });
    }

    const newUser = new User(userData);
    await newUser.save();
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        ...(role === "student" && {
          batch: newUser.batch,
          regNo: newUser.regNo,
          department: newUser.department
        })
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: { details: err.message }
    });
  }
};

// LOGIN
exports.login = (roleType) => async (req, res) => {
  try {
    let user;
    
    if (roleType === "student") {
      // Student login with regNo, batch, and department
      const { regNo, batch, department, password } = req.body;

      // Basic validation for student
      if (!regNo || !batch || !department || !password) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: { details: "Please provide registration number, batch, department and password" }
        });
      }

      // Find student by their unique credentials
      user = await User.findOne({ 
        regNo, 
        batch, 
        department,
        role: "student"
      });

    } else {
      // Admin and Tutor login with email
      const { email, password } = req.body;

      // Basic validation for admin/tutor
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: { details: "Please provide email and password" }
        });
      }

      // Find admin/tutor by email
      user = await User.findOne({ email, role: roleType });
    }

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed",
        error: { details: `${roleType} not found` }
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed",
        error: { details: "Invalid credentials" }
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Prepare user data based on role
    const userData = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    if (user.role === "student") {
      Object.assign(userData, {
        batch: user.batch,
        regNo: user.regNo,
        department: user.department
      });
    } else {
      // Add email for admin and tutor
      userData.email = user.email;
    }

    res.json({
      success: true,
      message: "Login successful",
      data: userData,
      token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: { details: err.message }
    });
  }
};

// Create Admin (This should be used only once to create the first admin)
exports.createAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { details: "Please fill all required fields" }
    });
  }

  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        error: { details: "Admin already exists" }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();
    
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: { details: err.message }
    });
  }
};
