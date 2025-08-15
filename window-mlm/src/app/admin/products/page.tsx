"use client";
export const dynamic = 'force-dynamic';
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type Product = {
	id: string;
	sku: string;
	name: string;
	base_price: number;
	is_active: boolean;
};

export default function AdminProducts() {
	const supabase = createClient();
	const [items, setItems] = useState<Product[]>([]);
	const [sku, setSku] = useState("");
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");

	const load = useCallback(async () => {
		const { data } = await supabase.from("products").select("id,sku,name,base_price,is_active").order("name");
		setItems((data as Product[]) ?? []);
	}, [supabase]);

	useEffect(() => {
		void load();
	}, [load]);

	const addProduct = async (e: React.FormEvent) => {
		e.preventDefault();
		await supabase.from("products").insert({ sku, name, base_price: Number(price), is_active: true });
		setSku(""); setName(""); setPrice("");
		await load();
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-4">
			<h1 className="text-xl font-semibold">Products</h1>
			<form onSubmit={addProduct} className="flex gap-2">
				<input className="border p-2 rounded flex-1" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
				<input className="border p-2 rounded flex-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
				<input className="border p-2 rounded w-32" placeholder="Base Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
				<button className="bg-black text-white dark:bg-white dark:text-black rounded px-3">Add</button>
			</form>
			<div className="divide-y border rounded">
				{items.map((p) => (
					<div key={p.id} className="p-3 text-sm flex items-center justify-between">
						<div>
							<div className="font-medium">{p.name}</div>
							<div className="opacity-80">{p.sku} • ₹{p.base_price}</div>
						</div>
						<div className="opacity-50">{p.is_active ? "Active" : "Inactive"}</div>
					</div>
				))}
				{items.length === 0 && <div className="p-3 text-sm opacity-80">No products.</div>}
			</div>
		</div>
	);
}