import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/model/category";

export async function GET() {
    await dbConnect();
    try {
        const category = await Category.find({}).sort({createdAt: -1})
        console.log(category);
        return NextResponse.json(category)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any) {
        return NextResponse.json({err: error.message},{status: 500})
    }
}

export async function POST(req:Request) {
    await dbConnect();
    const body = await req.json()
    const {name} = body;
    try {
     const category = await Category.create({name})
     console.log(category)
     return NextResponse.json(category)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error:any) {
      return NextResponse.json({err: error.message},{status: 500})
    }
}