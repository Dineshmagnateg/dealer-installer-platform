import { createServerSupabase } from "@/lib/serverSupabase";

export const dynamic = 'force-dynamic';
export default async function DealerCommissionsPage() {
	const supabase = createServerSupabase();
	const { data: userRes } = await supabase.auth.getUser();
	const userId = userRes.user?.id;
	if (!userId) return <div className="p-6">Please log in.</div>;
	const { data } = await supabase
		.from("commissions")
		.select("id, order_id, level, pct, amount, status, created_at")
		.eq("beneficiary", userId)
		.order("created_at", { ascending: false });
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-3">
			<h1 className="text-xl font-semibold">My Commissions</h1>
			<div className="divide-y border rounded">
				{(data ?? []).map((c) => (
					<div key={c.id} className="p-3 text-sm flex items-center justify-between">
						<div>Lvl {c.level} • Order: {c.order_id}</div>
						<div>₹{c.amount} • {c.status}</div>
					</div>
				))}
				{(data ?? []).length === 0 && <div className="p-3 text-sm opacity-80">No commissions yet.</div>}
			</div>
		</div>
	);
}