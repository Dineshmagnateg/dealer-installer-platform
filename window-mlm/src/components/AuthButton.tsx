"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function AuthButton() {
	const supabase = createClient();
	const router = useRouter();
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setEmail(data.user?.email ?? null);
		});
	}, [supabase]);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.refresh();
	};

	if (!email) {
		return (
			<button
				onClick={() => router.push("/login")}
				className="px-3 py-1 rounded bg-black text-white dark:bg-white dark:text-black"
			>
				Log in
			</button>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<span className="text-sm opacity-80">{email}</span>
			<button
				onClick={handleSignOut}
				className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600"
			>
				Sign out
			</button>
		</div>
	);
}