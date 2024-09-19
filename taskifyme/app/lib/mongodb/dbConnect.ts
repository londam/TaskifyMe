import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Define the MONGODB_URI env variable");

let cachedClient: mongoose.Mongoose | null = null;

async function dbConnect() {
  if (cachedClient) return cachedClient;

  try {
    cachedClient = await mongoose.connect(MONGODB_URI!);

    console.log("Connected to MongoDB!");
    return cachedClient;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export default dbConnect;
