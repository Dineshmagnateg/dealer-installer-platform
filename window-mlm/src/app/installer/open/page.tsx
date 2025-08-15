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
};

export default function OpenProjects() {
	const supabase = createClient();
	const [items, setItems] = useState<Project[]>([]);
	const [message, setMessage] = useState<string | null>(null);

	const load = useCallback(async () => {
		const { data } = await supabase
			.from("projects")
			.select("id, site_address, status, assigned_installer, created_at")
			.eq("status", "OPEN")
			.order("created_at", { ascending: false });
		setItems((data as Project[]) ?? []);
	}, [supabase]);
	useEffect(() => { void load(); }, [load]);

	const claim = async (projectId: string) => {
		setMessage(null);
		const res = await fetch("/api/projects/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ project_id: projectId }) });
		const data: { ok?: boolean; message?: string; error?: string } = await res.json();
		if (!data.ok) {
			setMessage(data.message ?? data.error ?? "Could not claim");
		} else {
			setMessage("Claimed!");
		}
		await load();
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-3">
			<h1 className="text-xl font-semibold">Open Projects</h1>
			{message && <div className="text-sm">{message}</div>}
			<div className="divide-y border rounded">
				{items.map((p) => (
					<div key={p.id} className="p-3 flex items-center justify-between">
						<div>
							<div className="font-medium">{p.site_address}</div>
							<div className="text-xs opacity-80">{p.status}</div>
						</div>
						<button onClick={() => claim(p.id)} className="px-3 py-1 rounded bg-black text-white dark:bg-white dark:text-black text-sm">Claim</button>
					</div>
				))}
				{items.length === 0 && <div className="p-3 text-sm opacity-80">No open projects.</div>}
			</div>
		</div>
	);
}