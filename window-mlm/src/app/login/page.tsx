"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const supabase = createClient();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			if (mode === "login") {
				const { error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
			} else {
				const { error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;
			}
			router.push("/");
			router.refresh();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Something went wrong";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">
				{mode === "login" ? "Log in" : "Sign up"}
			</h1>
			<form onSubmit={handleSubmit} className="space-y-3">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="w-full border rounded p-2"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="w-full border rounded p-2"
					required
				/>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="w-full bg-black text-white dark:bg-white dark:text-black rounded py-2">
					{loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
				</button>
			</form>
			<div className="mt-3 text-sm">
				{mode === "login" ? (
					<button onClick={() => setMode("signup")} className="underline">Need an account? Sign up</button>
				) : (
					<button onClick={() => setMode("login")} className="underline">Have an account? Log in</button>
				)}
			</div>
		</div>
	);
}