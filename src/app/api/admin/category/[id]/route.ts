import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/model/category";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: { params: Promise<{ id: any; }>; }) {
    await dbConnect();
    const body = await req.json();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...updateBody} = body;
        const { id } = await context.params;
        const updatingCategory = await Category.findByIdAndUpdate(
            id, updateBody,
            {new: true}
        )
        console.log("updatingCategory",updatingCategory);
        
        return NextResponse.json(updatingCategory)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      return NextResponse.json({err: error.message}, {status: 500})
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request, context: { params: Promise<{ id: any; }>; }) {
  await dbConnect();
  try {
   const { id } = await context.params;
   const deletingCategory = await Category.findByIdAndDelete(id)
   console.log("Xoá danh mục", deletingCategory);
   return NextResponse.json(deletingCategory);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error:any) {
    return NextResponse.json({err: error.message}, {status: 500})
  }
}