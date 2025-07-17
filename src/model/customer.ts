import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  address: { type: String },
  image: { type: String },
  status: { type: Boolean, default: true }
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export default Customer; 