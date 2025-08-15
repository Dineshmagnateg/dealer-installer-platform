

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">Dealer–Installer Window Platform</h1>
        <p className="mt-3 opacity-80">Onboard dealers and installers, manage quotes, automate payments and MLM commissions.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        <a href="/dealer" className="border rounded p-4 hover:bg-black/5 dark:hover:bg-white/10 transition">
          <div className="font-medium">Dealer</div>
          <div className="text-sm opacity-80">Create quotes, share payment links, track commissions and recruits.</div>
        </a>
        <a href="/installer" className="border rounded p-4 hover:bg-black/5 dark:hover:bg-white/10 transition">
          <div className="font-medium">Installer</div>
          <div className="text-sm opacity-80">Claim open projects and upload completion photos.</div>
        </a>
        <a href="/admin" className="border rounded p-4 hover:bg-black/5 dark:hover:bg-white/10 transition">
          <div className="font-medium">Admin</div>
          <div className="text-sm opacity-80">Approve applications, price quotes, manage products, projects and payouts.</div>
        </a>
        <a href="/login" className="border rounded p-4 hover:bg-black/5 dark:hover:bg-white/10 transition">
          <div className="font-medium">Login / Signup</div>
          <div className="text-sm opacity-80">Access your dashboard.</div>
        </a>
      </div>
    </div>
  );
}
