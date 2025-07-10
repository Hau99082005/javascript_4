import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Units from "@/model/units";


export async function GET() {
    await dbConnect();
    try {
     const unit = await Units.find({}).sort({createAt: -1})
     console.log("unit data", unit)
     return NextResponse.json(unit)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error : any) {
      return NextResponse.json({err: error.message},{status: 500});
    }
}

export async function POST(req: Request) {
    await dbConnect();
    const body = await req.json()

    const {name,symbol} = body
    console.log('name units', name || "symbol", symbol)

    try {
        const unit = await Units.create({name,symbol})
        console.log("unit", unit)
        return NextResponse.json(unit)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error : any) {
        console.log("error", error)
       return NextResponse.json({err: error.message},{status: 500})
    }
}