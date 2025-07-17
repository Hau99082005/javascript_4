import { NextResponse } from 'next/server';

// Lưu tạm vào biến (chỉ dùng cho demo, không dùng cho production)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customers: any[] = [];

export async function GET() {
  // Trả về danh sách khách hàng
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const body = await req.json();
  // Tạo id giả lập
  const newCustomer = { ...body, _id: Date.now().toString() };
  customers.push(newCustomer);
  return NextResponse.json(newCustomer, { status: 201 });
} 