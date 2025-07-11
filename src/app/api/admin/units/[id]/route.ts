import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Units from "@/model/units";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params; // Await params as required
  console.log(id);
  const body = await req.json();
  console.log("body", id);
  console.log("body", body);
  try {
    const { ...updateBody } = body.update;
    const updatingUnits = await Units.findByIdAndUpdate(
      id,
      updateBody,
      { new: true }
    );
    console.log("updating unit", updatingUnits);
    return NextResponse.json(updatingUnits);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request,  context: { params: Promise<{ id: string }> }) {
    await dbConnect();

    const params = await context.params;
    try {
    const deletingUnits = await Units.findByIdAndDelete(params.id)
    console.log("Xoá đơn vị",deletingUnits);
    return NextResponse.json(deletingUnits)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any) {
    return NextResponse.json({err: error.message},{status: 500})
    }
}