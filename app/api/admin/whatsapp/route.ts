import { NextRequest, NextResponse } from "next/server";
import { checkWhatsAppStatus, sendWhatsAppMessage } from "@/lib/whatsapp";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const status = await checkWhatsAppStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phone, message } = await req.json();
    if (!phone || !message) {
      return NextResponse.json({ error: "Phone and message are required" }, { status: 400 });
    }

    const result = await sendWhatsAppMessage(phone, message);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
