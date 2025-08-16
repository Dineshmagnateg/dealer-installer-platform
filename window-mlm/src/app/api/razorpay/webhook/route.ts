import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createServerSupabase } from "@/lib/serverSupabase";
import { computeCommissionAmounts, fetchCommissionPlan, getUplines } from "@/lib/mlm";

export async function POST(req: NextRequest) {
	const rawBody = await req.text();
	const signature = req.headers.get("x-razorpay-signature") || "";
	const ok = verifyWebhookSignature(rawBody, signature);
	if (!ok) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

	const payload = JSON.parse(rawBody);
	// Expecting payment.captured or order.paid events
	const paymentEntity = payload?.payload?.payment?.entity ?? payload?.payload?.order?.entity;
	if (!paymentEntity) return NextResponse.json({ skipped: true });

	const supabase = createServerSupabase();
	// Custom notes should carry our quote_id
	const quoteId = paymentEntity?.notes?.quote_id as string | undefined;
	const amount = Number(paymentEntity?.amount) / 100; // in INR
	if (!quoteId || !amount) return NextResponse.json({ error: "Missing data" }, { status: 400 });

	// Load quote and dealer
	const { data: quote, error: qErr } = await supabase
		.from("quotes")
		.select("id, dealer_id, address")
		.eq("id", quoteId)
		.maybeSingle();
	if (qErr || !quote) return NextResponse.json({ error: qErr?.message ?? "Quote not found" }, { status: 404 });

	// Create order
	const { data: order, error: oErr } = await supabase
		.from("orders")
		.insert({ quote_id: quote.id, amount, payment_ref: paymentEntity?.id, status: "PAID", paid_at: new Date().toISOString() })
		.select("id")
		.maybeSingle();
	if (oErr || !order) return NextResponse.json({ error: oErr?.message ?? "Order create failed" }, { status: 500 });

	// Calculate commissions
	const plan = await fetchCommissionPlan();
	const maxLevels = Number(process.env.MLM_MAX_LEVELS ?? plan.length);
	const uplines = await getUplines(quote.dealer_id, maxLevels);
	const planByLevel = plan.filter((p) => p.level <= uplines.length);
	const amounts = computeCommissionAmounts(amount, planByLevel);

	const commissionRows = amounts.map((row, idx) => ({
		order_id: order.id,
		beneficiary: uplines[idx],
		level: row.level,
		pct: row.pct,
		amount: row.amount,
		status: "UNPAID",
	}));
	if (commissionRows.length > 0) {
		const { error } = await supabase.from("commissions").insert(commissionRows);
		if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// Create project
	const { error: pErr } = await supabase
		.from("projects")
		.insert({ order_id: order.id, site_address: quote.address, status: "OPEN" });
	if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

	return NextResponse.json({ ok: true });
}