"use client";
export const dynamic = 'force-dynamic';
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type CommissionRow = {
	id: string;
	order_id: string;
	beneficiary: string | null;
	level: number;
	pct: number;
	amount: number;
	status: string;
	created_at: string;
};

export default function AdminCommissions() {
	const supabase = createClient();
	const [items, setItems] = useState<CommissionRow[]>([]);

	const load = useCallback(async () => {
		const { data } = await supabase
			.from("commissions")
			.select("id, order_id, beneficiary, level, pct, amount, status, created_at")
			.order("created_at", { ascending: false });
		setItems((data as CommissionRow[]) ?? []);
	}, [supabase]);
	useEffect(() => { void load(); }, [load]);

	const markPaid = async (id: string) => {
		await supabase.from("commissions").update({ status: "PAID" }).eq("id", id);
		await load();
	};

	return (
		<div className="max-w-5xl mx-auto p-6">
			<h1 className="text-xl font-semibold mb-4">Commissions</h1>
			<div className="divide-y border rounded">
				{items.map((c) => (
					<div key={c.id} className="p-3 text-sm flex items-center justify-between">
						<div>
							<div>Order: {c.order_id}</div>
							<div className="opacity-80">Lvl {c.level} • Beneficiary: {c.beneficiary} • {Math.round((c.pct ?? 0) * 10000) / 100}%</div>
						</div>
						<div className="flex items-center gap-3">
							<div>₹{c.amount}</div>
							{c.status === "UNPAID" ? (
								<button onClick={() => markPaid(c.id)} className="px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black">Mark paid</button>
							) : (
								<span className="opacity-60">PAID</span>
							)}
						</div>
					</div>
				))}
				{items.length === 0 && <div className="p-3 text-sm opacity-80">No commissions.</div>}
			</div>
		</div>
	);
}