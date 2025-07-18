import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Purchases from "@/model/purchases";

// PUT: Cập nhật đơn nhập hàng (thường là duyệt phiếu nhập)
export async function PUT(
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { params: Promise<{ id: any; }>; }
) {
  await dbConnect();

  try {
    const id  = context.params;

    const purchase = await Purchases.findById(id);
    if (!purchase) {
      return NextResponse.json(
        { message: "Không tìm thấy phiếu nhập hàng!" },
        { status: 404 }
      );
    }

    if (purchase.status === true) {
      return NextResponse.json(
        { message: "Đơn hàng đã được duyệt, không thể cập nhật lại." },
        { status: 400 }
      );
    }

    const body = await req.json();

    purchase.status = true;
    purchase.approved_by = body.approved_by || null;
    purchase.note = body.note || purchase.note;

    const updatedPurchase = await purchase.save();

    return NextResponse.json(updatedPurchase);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("PUT Purchases Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Xoá đơn nhập nếu chưa được duyệt
export async function DELETE(
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { params: Promise<{ id: any; }>; }
) {
  await dbConnect();

  try {
    const  id  = context.params;

    const purchase = await Purchases.findById(id);
    if (!purchase) {
      return NextResponse.json(
        { message: "Không tìm thấy phiếu nhập hàng!" },
        { status: 404 }
      );
    }

    if (purchase.status === true) {
      return NextResponse.json(
        { message: "Phiếu đã được duyệt, không thể xoá!" },
        { status: 400 }
      );
    }

    await Purchases.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Đã xoá phiếu nhập hàng thành công!",
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("DELETE Purchases Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
