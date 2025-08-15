import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/serverSupabase";

export async function POST(req: NextRequest) {
	const supabase = createServerSupabase();
	const { data: userResult } = await supabase.auth.getUser();
	const userId = userResult.user?.id;
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await req.json();
	const projectId = body?.project_id as string;
	if (!projectId) return NextResponse.json({ error: "project_id required" }, { status: 400 });

	// Ensure installer exists
	const { data: installer, error: iErr } = await supabase
		.from("installers")
		.select("user_id")
		.eq("user_id", userId)
		.maybeSingle();
	if (iErr || !installer) return NextResponse.json({ error: "Not an installer" }, { status: 403 });

	// Attempt to atomically claim project if OPEN
	const { data: updated, error: uErr } = await supabase
		.from("projects")
		.update({ assigned_installer: userId, status: "ASSIGNED" })
		.eq("id", projectId)
		.eq("status", "OPEN")
		.is("assigned_installer", null)
		.select("id, status, assigned_installer")
		.maybeSingle();

	if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
	if (!updated) return NextResponse.json({ ok: false, message: "Already claimed" });

	return NextResponse.json({ ok: true, project: updated });
}