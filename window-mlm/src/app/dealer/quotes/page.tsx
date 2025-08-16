import Link from "next/link";
import { createServerSupabase } from "@/lib/serverSupabase";

export const dynamic = 'force-dynamic';
export default async function DealerQuotesList() {
	const supabase = createServerSupabase();
	const { data: userRes } = await supabase.auth.getUser();
	const userId = userRes.user?.id;
	if (!userId) return <div className="p-6">Please log in.</div>;

	const { data: quotes } = await supabase
		.from("quotes")
		.select("id, customer_name, status, price, created_at")
		.eq("dealer_id", userId)
		.order("created_at", { ascending: false });

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-xl font-semibold">My Quotes</h1>
				<Link className="underline" href="/dealer/quotes/new">New</Link>
			</div>
			<div className="space-y-2">
				{(quotes ?? []).map((q) => (
					<div key={q.id} className="border rounded p-3 flex items-center justify-between">
						<div>
							<div className="font-medium">{q.customer_name}</div>
							<div className="text-xs opacity-80">{q.status} {q.price ? `• ₹${q.price}` : ""}</div>
						</div>
						<Link href={`/dealer/quotes/${q.id}`} className="underline text-sm">Open</Link>
					</div>
				))}
				{(quotes ?? []).length === 0 && <div className="text-sm opacity-80">No quotes yet.</div>}
			</div>
		</div>
	);
}