import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/model/category";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: { params: { id: any; }; }) {
    await dbConnect();
    const body = await req.json();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...updateBody} = body;
        const updatingCategory = await Category.findByIdAndUpdate(
            context.params.id, updateBody,
            {new: true}
        )
        return NextResponse.json(updatingCategory)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      return NextResponse.json({err: error.message}, {status: 500})
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request, context: { params: { id: any; }; }) {
  await dbConnect();
  try {
   const deletingCategory = await Category.findByIdAndDelete(context.params.id)
   return NextResponse.json(deletingCategory);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error:any) {
    return NextResponse.json({err: error.message}, {status: 500})
  }
}