const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectdb;
