require("dotenv").config();
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
const connectdb = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log("connect");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectdb;
