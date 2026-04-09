const mongoose = require("mongoose");

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI ;

  if (!mongoUri) {
    throw new Error("MONGODB_URI ontbreekt. Voeg deze toe in je .env bestand.");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log("Verbonden met MongoDB Atlas");
}

module.exports = {
  connectDatabase
};
