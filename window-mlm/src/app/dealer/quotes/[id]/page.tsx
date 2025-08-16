import { createServerSupabase } from "@/lib/serverSupabase";
import Link from "next/link";

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const supabase = createServerSupabase();
	const { data: quote, error } = await supabase
		.from("quotes")
		.select("id, customer_name, phone, address, status, price, created_at")
		.eq("id", id)
		.maybeSingle();
	if (error || !quote) return <div className="p-6">Quote not found.</div>;

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-3">
			<div className="text-sm opacity-80">Quote ID: {quote.id}</div>
			<h1 className="text-xl font-semibold">{quote.customer_name}</h1>
			<div className="opacity-80">{quote.phone}</div>
			<div className="opacity-80">{quote.address}</div>
			<div>Status: {quote.status} {quote.price ? `• ₹${quote.price}` : ""}</div>
			{quote.status === "PRICED" && (
				<div className="mt-4">
					<div className="text-sm opacity-80 mb-2">Share payment link with customer:</div>
					<pre className="text-xs p-3 bg-black/5 dark:bg-white/10 rounded overflow-x-auto">Pay ₹{quote.price} via Razorpay Checkout and ensure your backend creates the order with notes.quote_id = {quote.id}</pre>
					<div className="text-xs opacity-70 mt-2">(In production, use Razorpay Orders API to create a checkout order and email/SMS this link.)</div>
				</div>
			)}
			<Link href="/dealer/quotes" className="underline text-sm">Back</Link>
		</div>
	);
}