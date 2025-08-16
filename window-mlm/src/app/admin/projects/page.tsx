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

export default function AdminProjects() {
	const supabase = createClient();
	const [items, setItems] = useState<Project[]>([]);
	const [assignTo, setAssignTo] = useState<Record<string, string>>({});

	const load = useCallback(async () => {
		const { data } = await supabase
			.from("projects")
			.select("id, site_address, status, assigned_installer, created_at, done_at")
			.order("created_at", { ascending: false });
		setItems((data as Project[]) ?? []);
	}, [supabase]);
	useEffect(() => { void load(); }, [load]);

	const assign = async (id: string) => {
		const installerId = assignTo[id];
		if (!installerId) return;
		await supabase.from("projects").update({ assigned_installer: installerId, status: "ASSIGNED" }).eq("id", id);
		await load();
	};

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-4">
			<h1 className="text-xl font-semibold">Projects</h1>
			<div className="divide-y border rounded">
				{items.map((p) => (
					<div key={p.id} className="p-3 text-sm flex items-center justify-between">
						<div>
							<div className="font-medium">{p.site_address}</div>
							<div className="opacity-80">{p.status} • Installer: {p.assigned_installer ?? "-"}</div>
						</div>
						<div className="flex items-center gap-2">
							<input className="border p-1 rounded" placeholder="Installer user_id" value={assignTo[p.id] ?? ""} onChange={(e) => setAssignTo({ ...assignTo, [p.id]: e.target.value })} />
							<button onClick={() => assign(p.id)} className="px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black">Assign</button>
						</div>
					</div>
				))}
				{items.length === 0 && <div className="p-3 text-sm opacity-80">No projects.</div>}
			</div>
		</div>
	);
}