"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/study", label: "暗記", icon: "📚" },
  { href: "/", label: "今日", icon: "✨" },
  { href: "/products", label: "商品", icon: "💄" },
  { href: "/settings", label: "設定", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-[#eadfd4] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs transition ${
                active
                  ? "font-bold text-[#a88668]"
                  : "text-[#6b6560] hover:text-[#a88668]"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
