import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params;
  const body = await req.json();

  if (body._id) delete body._id;
  if (body.specs) {
    if (
      typeof body.specs !== "object" ||
      Array.isArray(body.specs) ||
      body.specs === null
    ) {
      delete body.specs;
    }
  }

  try {
    const updatingProduct = await Product.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );
    return NextResponse.json(updatingProduct);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const { id } = await context.params;
    const deletingProduct = await Product.findByIdAndDelete(id);
    return NextResponse.json(deletingProduct);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}