import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { to, amount, quote_id, checkout_url } = body as { to: string; amount: number; quote_id: string; checkout_url?: string };
	if (!to || !amount || !quote_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
	const url = checkout_url || `${process.env.NEXT_PUBLIC_SITE_URL}/pay?quote_id=${quote_id}`;
	await sendEmail(to, `Payment link for quote ${quote_id}`, `<p>Please pay ₹${amount} at <a href="${url}">${url}</a></p>`);
	return NextResponse.json({ ok: true });
}