"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileStack,
  BadgeCheck,
  ClipboardCheck,
  FolderOpen,
  CheckSquare,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NAV_GROUPS } from "@/lib/types";
import { useStore } from "@/lib/store";
import { asset } from "@/lib/paths";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  FileStack,
  BadgeCheck,
  ClipboardCheck,
  FolderOpen,
  CheckSquare,
  CreditCard,
  Settings,
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!auth) router.replace("/login");
  }, [auth, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!auth) {
    return (
      <div className="grid min-h-screen place-items-center bg-white text-[#002D62]">
        Redirecting to login…
      </div>
    );
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon];
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#002D62] text-white"
                      : "text-[#5A6A7A] hover:bg-[#F5F7FA] hover:text-[#002D62]"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#002D62]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#E2E8F0] bg-white px-3 sm:h-16 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-[#002D62] hover:bg-[#F5F7FA] lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img src={asset("/logo.png")} alt="Licenses in Florida" className="h-8 w-auto object-contain sm:h-10" />
          <div className="hidden min-[400px]:block">
            <p className="text-sm font-bold leading-tight">Licenses Admin</p>
            <p className="text-xs text-[#5A6A7A]">Client operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{auth.name}</p>
            <p className="text-xs text-[#5A6A7A] truncate max-w-[180px]">{auth.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-2.5 py-2 text-sm font-medium hover:border-[#FF8C00] hover:text-[#FF8C00] sm:px-3"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Desktop left sidebar */}
      <aside className="fixed bottom-0 left-0 top-14 z-30 hidden w-[240px] flex-col border-r border-[#E2E8F0] bg-white sm:top-16 lg:flex">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <aside className="absolute bottom-0 left-0 top-0 flex w-[min(288px,88vw)] flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-[#E2E8F0] px-3">
              <p className="font-bold text-[#002D62]">Menu</p>
              <button type="button" className="rounded-lg p-2 hover:bg-[#F5F7FA]" onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <main className="min-h-screen pt-14 sm:pt-16 lg:pl-[240px]">
        <div className="mx-auto max-w-[1400px] p-3 sm:p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
