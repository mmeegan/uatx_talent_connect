import Link from "next/link";

type DashboardNavProps = {
  mainHref: string;
  mainLabel: string;
};

export default function DashboardNav({ mainHref, mainLabel }: DashboardNavProps) {
  return (
    <header className="bg-uatx-ink border-b border-uatx-gold/20">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="font-display text-xl uppercase tracking-widest text-uatx-ivory">
          Bridge
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href={mainHref}
            className="text-small font-medium text-uatx-ivory"
          >
            {mainLabel}
          </Link>
          <span className="text-uatx-ivory/40">|</span>
          <Link
            href="/dashboard/profile"
            className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors"
          >
            Settings
          </Link>
          <Link
            href="/api/auth/signout"
            className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors"
          >
            Sign out
          </Link>
        </nav>
      </div>
    </header>
  );
}
