import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    buying_qty: {
      type: Number,
      required: true,
      min: [1, "Số lượng phải lớn hơn 0"],
    },
    unit_price: {
      type: Number,
      required: true,
      min: [0, "Đơn giá không hợp lệ"],
    },
    total_price: {
      type: Number,
      required: true,
      min: [0, "Tổng giá không hợp lệ"],
    },
  },
  { _id: false }
);

const PurchasesSchema = new mongoose.Schema(
  {
    purchase_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      default: "",
    },
    products: {
      type: [purchaseItemSchema],
      required: true,
      validate: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (val: any[]) => val.length > 0,
        "Phải có ít nhất một sản phẩm trong phiếu nhập",
      ],
    },
    status: {
      type: Boolean,
      default: false,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    note: {
      type: String,
      default: "",
    },
    invoice_file_url: {
      type: String,
    },
  },
  { timestamps: true }
);

const Purchases =
  mongoose.models.Purchases || mongoose.model("Purchases", PurchasesSchema);
export default Purchases;
