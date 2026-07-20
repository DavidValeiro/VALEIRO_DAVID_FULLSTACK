const mongoose = require("mongoose");
const env = require('dotenv');
env.config();
const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGODB_URI:", MONGODB_URI);

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection; // ya conectado
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI);
  console.log("Conectado a MongoDB Atlas");
  return mongoose.connection;
}

module.exports = connectDB;