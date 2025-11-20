import dotenv from "dotenv";
import session from "express-session";
import MongoDBStoreSession from "connect-mongodb-session";
import mongoose from "mongoose";

dotenv.config();

// SESSION STORE
const MongoDBStore = MongoDBStoreSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR:", err);
  process.exit(1);
});

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export default store;