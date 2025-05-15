const mongoose = require("mongoose");
const uri =
  "mongodb+srv://ha1qua:8SpUNUrp9N#EmwJ@cluster0.ciwrg8x.mongodb.net/";
const connectdb = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log("connect");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectdb;
