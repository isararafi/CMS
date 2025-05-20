const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

require("dotenv").config();

// REGISTER
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    if (!["student", "tutor", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
exports.login = (roleType) => async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: roleType });
    if (!user) return res.status(400).json({ msg: `${roleType} not found` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
