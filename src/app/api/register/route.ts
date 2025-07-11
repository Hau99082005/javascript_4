import { NextResponse } from "next/server";
import User from "@/model/user";
import dbConnect from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import type { NextRequest } from "next/server";

// Xử lý preflight CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withCORSHeaders(json: any, status = 200) {
  return NextResponse.json(json, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, phone } = body;
    console.log({name, email, password, phone});
    if (!name || !email || !password || !phone) {
      return withCORSHeaders({ err: "Missing required fields" }, 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name,
      email,
      phone,
      password: hashedPassword,
    }).save();
    console.log("user created successfully!", user);
    return withCORSHeaders({ msg: "register successfully!" }, 200);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return withCORSHeaders({ err: error.message || "Server error" }, 500);
  }
}

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("+password");
    return withCORSHeaders(users, 200);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return withCORSHeaders({ err: error.message || "Server error" }, 500);
  }
}