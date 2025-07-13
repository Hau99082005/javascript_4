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
  const {name, email, phone, address, status, logoUrl, note, createdAt, updatedAt} = body;
  try {
    const supplier = await Supplier.create({name, email, phone, address, status, logoUrl, note, createdAt, updatedAt})
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