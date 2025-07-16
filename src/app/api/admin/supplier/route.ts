import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Supplier from "@/model/supplier";

export async function GET() {
    await dbConnect();
    try {
        const supplier = await Supplier.find({}).sort({createdAt: -1});
        return NextResponse.json(supplier);
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
        return NextResponse.json({err: error.message}, {status: 500});
    }
}

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const {name, email, phone, address, status, logoUrl, logoData, note} = body;
  try {
    // Validate các trường bắt buộc
    if (!name || !email || !phone || !address) {
      return NextResponse.json({err: "Thiếu thông tin bắt buộc."}, {status: 400});
    }
    // Nếu không có logoUrl và cũng không có logoData thì vẫn cho phép, sẽ dùng fallback ở FE
    const supplier = await Supplier.create({name, email, phone, address, status, logoUrl, logoData, note});
    console.log("supplier", supplier);
    return NextResponse.json(supplier)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch(error: any) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return NextResponse.json({err: "Email đã tồn tại trong hệ thống."}, {status: 400});
    }
    console.log(error)
    return NextResponse.json({err: error.message}, {status: 500})
  }
}