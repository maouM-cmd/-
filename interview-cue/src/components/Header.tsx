import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="group">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Interview Cue
          </p>
          <h1 className="text-lg font-bold text-slate-900 group-hover:text-sky-700">
            面接原稿カンニング
          </h1>
        </Link>
      </div>
    </header>
  );
}
