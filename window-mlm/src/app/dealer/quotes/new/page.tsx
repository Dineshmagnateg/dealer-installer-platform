"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewQuotePage() {
	const supabase = createClient();
	const router = useRouter();
	const [customerName, setCustomerName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [measurements, setMeasurements] = useState("{}");
	// Attachments upload can be added later
	// const [attachments, setAttachments] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const { data: userRes } = await supabase.auth.getUser();
			const dealerId = userRes.user?.id;
			if (!dealerId) throw new Error("Not logged in");
			const parsed = JSON.parse(measurements || "{}");
			const { error } = await supabase.from("quotes").insert({
				dealer_id: dealerId,
				customer_name: customerName,
				phone,
				address,
				measurements_json: parsed,
				// attachments,
				status: "SUBMITTED",
			});
			if (error) throw error;
			router.push("/dealer/quotes");
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Failed to create quote";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-xl font-semibold mb-4">New Quote</h1>
			<form onSubmit={handleSubmit} className="space-y-3">
				<input className="w-full border p-2 rounded" placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
				<input className="w-full border p-2 rounded" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
				<textarea className="w-full border p-2 rounded" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
				<textarea className="w-full border p-2 rounded font-mono" placeholder='Measurements JSON e.g. {"width":100,"height":200}' value={measurements} onChange={(e) => setMeasurements(e.target.value)} />
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="bg-black text-white dark:bg-white dark:text-black rounded px-4 py-2">{loading ? "Saving..." : "Submit for pricing"}</button>
			</form>
		</div>
	);
}