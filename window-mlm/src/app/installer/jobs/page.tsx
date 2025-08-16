"use client";
export const dynamic = 'force-dynamic';
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type Project = {
	id: string;
	site_address: string;
	status: string;
	assigned_installer: string | null;
	created_at: string;
	done_at: string | null;
};

export default function MyJobs() {
	const supabase = createClient();
	const [items, setItems] = useState<Project[]>([]);
	const [message, setMessage] = useState<string | null>(null);

	const load = useCallback(async () => {
		const { data: userRes } = await supabase.auth.getUser();
		const userId = userRes.user?.id;
		if (!userId) return;
		const { data } = await supabase
			.from("projects")
			.select("id, site_address, status, assigned_installer, created_at, done_at")
			.eq("assigned_installer", userId)
			.order("created_at", { ascending: false });
		setItems((data as Project[]) ?? []);
	}, [supabase]);
	useEffect(() => { void load(); }, [load]);

	const markDone = async (id: string) => {
		await supabase.from("projects").update({ status: "DONE", done_at: new Date().toISOString() }).eq("id", id);
		setMessage("Marked as done");
		await load();
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-3">
			<h1 className="text-xl font-semibold">My Jobs</h1>
			{message && <div className="text-sm">{message}</div>}
			<div className="divide-y border rounded">
				{items.map((p) => (
					<div key={p.id} className="p-3 flex items-center justify-between">
						<div>
							<div className="font-medium">{p.site_address}</div>
							<div className="text-xs opacity-80">{p.status}</div>
						</div>
						{p.status !== "DONE" ? (
							<button onClick={() => markDone(p.id)} className="px-3 py-1 rounded bg-black text-white dark:bg-white dark:text-black text-sm">Mark done</button>
						) : (
							<span className="opacity-60 text-sm">Completed</span>
						)}
					</div>
				))}
				{items.length === 0 && <div className="p-3 text-sm opacity-80">No jobs yet.</div>}
			</div>
		</div>
	);
}