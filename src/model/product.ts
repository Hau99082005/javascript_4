import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number, // giá gạch ngang nếu có khuyến mãi
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String, // ảnh đại diện
      required: true,
    },
    gallery: [
      {
        type: String, // nhiều ảnh khác
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String, // mã sản phẩm
    },
    warranty: {
      type: String, // ví dụ: "12 tháng"
    },
    specs: {
      type: Map,
      of: String, // key-value: RAM, ROM, CPU...
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean, // hiển thị trong "Sản phẩm nổi bật"
      default: false,
    },
    unitNameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Units",
      required: true,
    },
    categoryNameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplierNameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
