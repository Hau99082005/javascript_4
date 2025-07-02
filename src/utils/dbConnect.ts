import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const uri = process.env.DB_URI;
  if (!uri) {
    throw new Error("Missing DB_URI in environment variables");
  }
  await mongoose.connect(uri);
};

export default dbConnect;