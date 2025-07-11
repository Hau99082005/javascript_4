import dbConnect from "@/utils/dbConnect";
import Supplier from "@/model/supplier";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Đổi * thành domain FE nếu cần bảo mật
  "Access-Control-Allow-Methods": "PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();

  try {
    const updatingSupplier = await Supplier.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true }
    );
    return new Response(JSON.stringify({ updatingSupplier }), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ err: error.message }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const deletingSupplier = await Supplier.findByIdAndDelete(params.id);
    return new Response(JSON.stringify(deletingSupplier), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ err: error.message }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  }
}