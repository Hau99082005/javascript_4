import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Supplier from "@/model/supplier";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: { params: Promise<{ id: any; }>; }) {
    await dbConnect();
    const body = await req.json();

    try {
     const updatingSupplier=await Supplier.findByIdAndUpdate(
         (await context.params).id,
         {...body},
         {new: true},
     )
     return NextResponse.json({updatingSupplier})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any) {
       return NextResponse.json({err: error.message}, {status: 500})
    }

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request, context: { params: Promise<{ id: any; }>; }) {
     await dbConnect();
     try {
        const deletingSupplier = await Supplier.findByIdAndDelete(
            (await context.params).id,)
      return NextResponse.json(deletingSupplier);

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     }catch(error: any) {
      return NextResponse.json({err: error.message}, {status: 500})
     }
}