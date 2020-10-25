const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    console.log("\nMongo connected...");
  } catch (err) {
    console.log(err.message);
    // exit with failure
    process.exit(1);
  }
};
module.exports = connectDB;
