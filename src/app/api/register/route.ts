import { NextResponse } from "next/server";
import User from "@/model/user";
import dbConnect from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, phone } = body;
    console.log({name, email, password, phone});
    if (!name || !email || !password || !phone) {
      return NextResponse.json({ err: "Missing required fields" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name,
      email,
      phone,
      password: hashedPassword,
    }).save();
    console.log("user created successfully!", user);
    return NextResponse.json({ msg: "register successfully!" }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ err: error.message || "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("+password");
    return NextResponse.json(users, { status: 200 });
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ err: error.message || "Server error" }, { status: 500 });
  }
}