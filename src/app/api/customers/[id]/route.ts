import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Customer from '@/model/customer';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params;
  const data = await req.json();
  try {
    const updated = await Customer.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ message: 'Không tìm thấy khách hàng' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    let message = 'Lỗi cập nhật khách hàng';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ message: `Lỗi cập nhật khách hàng: ${message}` }, { status: 500 });
  }
} 