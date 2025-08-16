import Link from "next/link";

export default function AdminPage() {
	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Admin Dashboard</h1>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Applications</h2>
					<div className="text-sm opacity-80 mb-3">Approve dealers and installers.</div>
					<Link href="/admin/applications" className="underline">Manage applications</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Products</h2>
					<div className="text-sm opacity-80 mb-3">Upload/edit product catalog.</div>
					<Link href="/admin/products" className="underline">Manage products</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Quotes</h2>
					<div className="text-sm opacity-80 mb-3">Review quotes and set final price.</div>
					<Link href="/admin/quotes" className="underline">Review quotes</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Projects</h2>
					<div className="text-sm opacity-80 mb-3">Assign installers and track jobs.</div>
					<Link href="/admin/projects" className="underline">Manage projects</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Commissions</h2>
					<div className="text-sm opacity-80 mb-3">Configure MLM and monitor payouts.</div>
					<Link href="/admin/commissions" className="underline">Commission center</Link>
				</div>
			</div>
		</div>
	);
}