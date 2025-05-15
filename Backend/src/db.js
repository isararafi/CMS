const mongoose = require("mongoose");
const uri =
  "mongodb+srv://sararafi102:3VLG4jaq0ZqBfS85@database1.wcdz6cb.mongodb.net/";
const connectdb = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log("connect");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectdb;
