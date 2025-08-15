"use client";
export const dynamic = 'force-dynamic';
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type Quote = {
	id: string;
	customer_name: string;
	phone: string;
	address: string;
	status: string;
	price: number | null;
	created_at: string;
};

export default function AdminQuotes() {
	const supabase = createClient();
	const [items, setItems] = useState<Quote[]>([]);
	const [pricing, setPricing] = useState<Record<string, string>>({});

	const load = useCallback(async () => {
		const { data } = await supabase
			.from("quotes")
			.select("id, customer_name, phone, address, status, price, created_at")
			.order("created_at", { ascending: false });
		setItems((data as Quote[]) ?? []);
	}, [supabase]);

	useEffect(() => { void load(); }, [load]);

	const setPrice = async (id: string) => {
		const priceStr = pricing[id];
		const amount = Math.round(Number(priceStr) * 100);
		if (!amount) return;
		await supabase.from("quotes").update({ status: "PRICED", price: amount / 100 }).eq("id", id);
		await load();
	};

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-4">
			<h1 className="text-xl font-semibold">Quotes</h1>
			<div className="space-y-2">
				{items.map((q) => (
					<div key={q.id} className="border rounded p-3">
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">{q.customer_name}</div>
								<div className="text-xs opacity-80">{q.phone} • {q.status} {q.price ? `• ₹${q.price}` : ""}</div>
							</div>
							{q.status !== "PRICED" && (
								<div className="flex items-center gap-2">
									<input className="border p-1 rounded w-24" placeholder="Price" value={pricing[q.id] ?? ""} onChange={(e) => setPricing({ ...pricing, [q.id]: e.target.value })} />
									<button onClick={() => setPrice(q.id)} className="px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black text-sm">Set</button>
								</div>
							)}
						</div>
					</div>
				))}
				{items.length === 0 && <div className="text-sm opacity-80">No quotes.</div>}
			</div>
		</div>
	);
}