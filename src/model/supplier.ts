import mongoose, { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  logoUrl?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, "Email không hợp lệ"],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  logoUrl: {
    type: String,
    default: "",
  },
  note: {
    type: String,
    default: "",
    trim: true,
  },
}, { timestamps: true });

const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>("Supplier", SupplierSchema);

export default Supplier;
