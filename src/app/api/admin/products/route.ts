import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";

export async function GET() {
    await dbConnect();
    try {
    const product = await Product.find({})
    .populate("unitNameId")
    .populate("categoryNameId")
    .populate("supplierNameId")
    return NextResponse.json(product)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error : any) {
     console.log("error", error);
     return NextResponse.json({err: error.message}, {status: 500});
    }
}


export async function POST(req: Request) {
     await dbConnect();
     const body = await req.json();
     const {productName, description, price, oldPrice, quantity, image, gallery, brand, model, warranty, specs, slug, 
        status, isFeatured, unitNameId, categoryNameId, supplierNameId
     } = body;
     try {
        const product = await Product.create({
            productName, description, price, oldPrice, quantity, image, gallery, brand, model, warranty, specs, slug,
            status, isFeatured, unitNameId, categoryNameId, supplierNameId
        })
        return NextResponse.json(product)

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     }catch(error: any) {
       console.log("error", error);
       return NextResponse.json({err: error.message}, {status: 500})
     }
}