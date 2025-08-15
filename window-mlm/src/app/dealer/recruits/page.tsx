import { createServerSupabase } from "@/lib/serverSupabase";

export const dynamic = 'force-dynamic';
export default async function DealerRecruitsPage() {
	const supabase = createServerSupabase();
	const { data: userRes } = await supabase.auth.getUser();
	const userId = userRes.user?.id;
	if (!userId) return <div className="p-6">Please log in.</div>;
	const { data } = await supabase
		.from("dealers")
		.select("user_id")
		.eq("referrer_id", userId);
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-3">
			<h1 className="text-xl font-semibold">My Recruits</h1>
			<div className="divide-y border rounded">
				{(data ?? []).map((d) => (
					<div key={d.user_id} className="p-3 text-sm">{d.user_id}</div>
				))}
				{(data ?? []).length === 0 && <div className="p-3 text-sm opacity-80">No recruits yet.</div>}
			</div>
		</div>
	);
}