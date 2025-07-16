import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Customers from "@/model/customers";


export async function GET() {
    await dbConnect();
    try {
        const customer = await Customers.find({}).sort({createdAt: -1})
        return NextResponse.json(customer)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error : any) {
      
        return NextResponse.json({err: error.message}, {status: 500})
    }
}

export async function POST(req: Request) {
    await dbConnect();
    const body = await req.json();
    const {name, email,phone,image,address,status} = body;

    try {
       const customer = await Customers.create({name: name, email: email, phone: phone, image: image, address: address, status: status})
       return NextResponse.json(customer)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any) {
     console.log(error);
     return NextResponse.json({err: error.message}, {status: 500})
    }
}