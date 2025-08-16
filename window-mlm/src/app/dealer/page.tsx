import Link from "next/link";

export default function DealerPage() {
	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Dealer Dashboard</h1>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Create Quote</h2>
					<div className="text-sm opacity-80 mb-3">Fill customer details, measurements, and upload photos.</div>
					<Link href="/dealer/quotes/new" className="underline">New quote</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">My Quotes</h2>
					<Link href="/dealer/quotes" className="underline">View quotes</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Commissions</h2>
					<Link href="/dealer/commissions" className="underline">View commissions</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">My Recruits</h2>
					<Link href="/dealer/recruits" className="underline">View team</Link>
				</div>
			</div>
		</div>
	);
}