import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Customers from "@/model/customers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: { params: Promise<{ id: any; }>; }) {
     await dbConnect();
     const body = await req.json();
     try {
        const updatingCustomer = await Customers.findByIdAndUpdate(
            (await context.params).id,
            body,
            {new: true},
        )
        return NextResponse.json(updatingCustomer);

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     }catch(error: any) {
       console.log(error);
       return NextResponse.json({err: error.message}, {status: 500});
     }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request, context: { params: Promise<{ id: any; }>; }) {
    await dbConnect();

    try {
        const deletingCustomer = await Customers.findByIdAndDelete((await context.params).id)
        return NextResponse.json(deletingCustomer);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any) {
      console.log(error);
      return NextResponse.json({err: error.message}, {status: 500});
    }
}