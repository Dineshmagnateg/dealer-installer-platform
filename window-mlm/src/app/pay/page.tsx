import { createServerSupabase } from "@/lib/serverSupabase";

export default async function PayPage({ searchParams }: { searchParams: Promise<{ quote_id?: string }> }) {
	const { quote_id } = await searchParams;
	const supabase = createServerSupabase();
	const quoteId = quote_id;
	if (!quoteId) return <div className="p-6">Missing quote_id</div>;
	const { data: quote } = await supabase
		.from("quotes")
		.select("id, customer_name, price, status")
		.eq("id", quoteId)
		.maybeSingle();
	if (!quote) return <div className="p-6">Quote not found.</div>;
	return (
		<div className="max-w-xl mx-auto p-6 space-y-3">
			<h1 className="text-xl font-semibold">Payment</h1>
			<div>Quote: {quote.id}</div>
			<div>Customer: {quote.customer_name}</div>
			<div>Amount: ₹{quote.price}</div>
			<div className="text-sm opacity-80">This is a demo page. In production, integrate Razorpay Checkout and redirect back to order confirmation.</div>
		</div>
	);
}