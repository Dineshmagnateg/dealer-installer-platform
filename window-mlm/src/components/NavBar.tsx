import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function NavBar() {
	return (
		<nav className="w-full border-b border-black/10 dark:border-white/10">
			<div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
				<Link href="/" className="font-semibold">WindowMLM</Link>
				<div className="flex items-center gap-4 text-sm">
					<Link href="/dealer">Dealer</Link>
					<Link href="/installer">Installer</Link>
					<Link href="/admin">Admin</Link>
					<AuthButton />
				</div>
			</div>
		</nav>
	);
}