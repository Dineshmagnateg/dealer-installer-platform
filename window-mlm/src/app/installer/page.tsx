import Link from "next/link";

export default function InstallerPage() {
	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Installer Dashboard</h1>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">Open Projects</h2>
					<Link href="/installer/open" className="underline">Browse & claim</Link>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium mb-2">My Jobs</h2>
					<Link href="/installer/jobs" className="underline">View assigned</Link>
				</div>
			</div>
		</div>
	);
}