import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: { params: Promise<{ id: any; }>; }) {
 await dbConnect();
 const body = await req.json();

 try {
    const updatingProduct = await Product.findByIdAndUpdate(
        (await context.params).id,
        body,
        {new: true}
    )
    return NextResponse.json(updatingProduct)

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 }catch(error : any) {
     console.log("error", error);
     return NextResponse.json({err: error.message}, {status: 500});
 }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request, context: { params: Promise<{ id: any; }>; }) {
   await dbConnect();

   try {
    const deletingProduct = await Product.findByIdAndDelete(
        (await context.params).id,
    )
    return NextResponse.json(deletingProduct);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   }catch(error : any) {
    console.log("error", error)
    return NextResponse.json({err: error.message}, {status: 500});
   }
}