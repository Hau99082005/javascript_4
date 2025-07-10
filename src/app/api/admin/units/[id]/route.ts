import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Units from "@/model/units";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: { params: { id: any; }; }) {
  await dbConnect();
  const params = await context.params;
  const body = await req.json()
  try {
   const {...updateBody} = body.update 
   const updatingUnits = await Units.findByIdAndUpdate(
    params.id,
    updateBody,
    {new : true}
   )
   return NextResponse.json(updatingUnits)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error: any) {
   return NextResponse.json({err: error.message}, {status: 500})
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request,  context: { params: { id: any; }; }) {
    await dbConnect();
    const params = await context.params;
    try {
    const deletingUnits = await Units.findByIdAndDelete(params.id)
    return NextResponse.json(deletingUnits)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any) {
    return NextResponse.json({err: error.message},{status: 500})
    }
}