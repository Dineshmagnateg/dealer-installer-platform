import { createServerSupabase } from "@/lib/serverSupabase";

export type CommissionPlanRow = { level: number; pct: number; is_active: boolean };

type SupabaseResponse<T> = { data: T | null; error: { message: string } | null };

export async function fetchCommissionPlan(): Promise<CommissionPlanRow[]> {
	const supabase = createServerSupabase();
	const res: SupabaseResponse<unknown> = await supabase
		.from("commission_plan")
		.select("level,pct,is_active")
		.eq("is_active", true)
		.order("level");
	if (res.error) throw new Error(res.error.message);
	return (res.data as CommissionPlanRow[]) ?? [];
}

export async function getUplines(dealerUserId: string, maxLevels: number): Promise<string[]> {
	const supabase = createServerSupabase();
	const uplines: string[] = [];
	let currentId: string | null = dealerUserId;
	for (let depth = 0; depth < maxLevels; depth++) {
		if (!currentId) break;
		type Row = { referrer_id: string | null } | null;
		const res: SupabaseResponse<unknown> = await supabase
			.from("dealers")
			.select("referrer_id")
			.eq("user_id", currentId)
			.maybeSingle();
		if (res.error) throw new Error(res.error.message);
		const ref = (res.data as Row)?.referrer_id ?? null;
		if (ref) uplines.push(ref);
		currentId = ref;
	}
	return uplines;
}

export function computeCommissionAmounts(amount: number, plan: CommissionPlanRow[]) {
	return plan.map((p) => ({ level: p.level, pct: p.pct, amount: Math.round(amount * p.pct * 100) / 100 }));
}