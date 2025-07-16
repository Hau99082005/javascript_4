import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên khách hàng là bắt buộc"],
    trim: true,
    maxlength: [100, "Tên không được vượt quá 100 ký tự"],
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, "Email không hợp lệ"],
  },
  phone: {
    type: String,
    required: [true, "Số điện thoại là bắt buộc"],
    trim: true,
    match: [/^[0-9]{9,15}$/, "Số điện thoại không hợp lệ"],
  },
  image: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Customers = mongoose.models.Customers || mongoose.model("Customers", CustomerSchema);
export default Customers;
