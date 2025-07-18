import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Purchases from "@/model/purchases";
export async function GET() {
  await dbConnect();

  try {
    const purchases = await Purchases.find({})
      .populate("supplier_id")
      .populate("products.product_id")
      .populate("products.category_id")
      .populate("approved_by");

    return NextResponse.json(purchases);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("GET Purchases Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();

    const {
      purchase_no,
      supplier_id,
      date,
      description,
      products, 
      note,
      invoice_file_url,
    } = body;
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Danh sách sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const newPurchase = await Purchases.create({
      purchase_no,
      supplier_id,
      date,
      description,
      products,
      note,
      invoice_file_url,
      status: false,
    });

    return NextResponse.json(newPurchase);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("POST Purchases Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
