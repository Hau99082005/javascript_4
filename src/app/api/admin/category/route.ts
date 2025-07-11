// import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/model/category";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Có thể thay * bằng domain FE cụ thể nếu cần bảo mật
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
    await dbConnect();
    try {
        const category = await Category.find({}).sort({createdAt: -1})
        console.log(category);
        return new Response(JSON.stringify(category), {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any) {
        return new Response(JSON.stringify({err: error.message}), {
          status: 500,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        });
    }
}

export async function POST(req:Request) {
    await dbConnect();
    const body = await req.json()
    const {name, status = true} = body;
    console.log("category name", name);
    try {
     const category = await Category.create({name, status})
     console.log(category)
     return new Response(JSON.stringify(category), {
       status: 200,
       headers: {
         ...CORS_HEADERS,
         "Content-Type": "application/json",
       },
     });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error:any) {
      return new Response(JSON.stringify({err: error.message}), {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      });
    }
}