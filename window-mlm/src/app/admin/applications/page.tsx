"use client";
export const dynamic = 'force-dynamic';
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type Profile = {
	id: string;
	role: "dealer" | "installer" | "admin" | null;
	name: string | null;
	phone: string | null;
	created_at: string;
};

export default function AdminApplications() {
	const supabase = createClient();
	const [users, setUsers] = useState<Profile[]>([]);
	const [serviceArea, setServiceArea] = useState<Record<string, string>>({});
	const [referrer, setReferrer] = useState<Record<string, string>>({});

	const load = useCallback(async () => {
		const { data } = await supabase
			.from("profiles")
			.select("id, role, name, phone, created_at")
			.order("created_at", { ascending: false });
		setUsers((data as Profile[]) ?? []);
	}, [supabase]);
	useEffect(() => { void load(); }, [load]);

	const approveDealer = async (userId: string) => {
		await supabase.from("profiles").update({ role: "dealer" }).eq("id", userId);
		await supabase.from("dealers").insert({ user_id: userId, referrer_id: referrer[userId] || null });
		await load();
	};
	const approveInstaller = async (userId: string) => {
		await supabase.from("profiles").update({ role: "installer" }).eq("id", userId);
		await supabase.from("installers").insert({ user_id: userId, service_area: serviceArea[userId] || null });
		await load();
	};

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-4">
			<h1 className="text-xl font-semibold">Applications</h1>
			<div className="divide-y border rounded">
				{users.map((u) => (
					<div key={u.id} className="p-3 text-sm flex items-center justify-between">
						<div>
							<div className="font-medium">{u.name ?? u.id}</div>
							<div className="opacity-80">{u.role ?? "pending"} • {u.phone ?? ""}</div>
						</div>
						<div className="flex items-center gap-2">
							<input className="border p-1 rounded" placeholder="Referrer dealer id" value={referrer[u.id] ?? ""} onChange={(e) => setReferrer({ ...referrer, [u.id]: e.target.value })} />
							<button onClick={() => approveDealer(u.id)} className="px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black">Approve dealer</button>
							<input className="border p-1 rounded" placeholder="Service area" value={serviceArea[u.id] ?? ""} onChange={(e) => setServiceArea({ ...serviceArea, [u.id]: e.target.value })} />
							<button onClick={() => approveInstaller(u.id)} className="px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black">Approve installer</button>
						</div>
					</div>
				))}
				{users.length === 0 && <div className="p-3 text-sm opacity-80">No applications.</div>}
			</div>
		</div>
	);
}