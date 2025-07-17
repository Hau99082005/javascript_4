import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Customer from '@/model/customer';

export async function GET() {
  await dbConnect();
  try {
    const customers = await Customer.find({});
    return NextResponse.json(customers);
  } catch (err: unknown) {
    let message = 'Lỗi tải danh sách khách hàng';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ message: `Lỗi tải danh sách khách hàng: ${message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  try {
    const newCustomer = await Customer.create(data);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (err: unknown) {
    let message = 'Lỗi thêm khách hàng';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ message: `Lỗi thêm khách hàng: ${message}` }, { status: 500 });
  }
} 