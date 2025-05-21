const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "tutor", "admin"], required: true },
  // Additional fields for students
  batch: { type: String, required: function() { return this.role === "student" } }, // e.g., "Fall-22"
  regNo: { type: String, required: function() { return this.role === "student" } }, // e.g., "095"
  department: { type: String, required: function() { return this.role === "student" } }, // e.g., "BSSE"
  // Fields will only be required if the role is student
});

module.exports = mongoose.model("User", userSchema);
