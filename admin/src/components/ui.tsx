"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-[#002D62] sm:text-2xl lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#5A6A7A] sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "navy",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "navy" | "orange" | "green" | "red" | "gray";
}) {
  const tones = {
    navy: "border-[#002D62]/15 bg-white",
    orange: "border-[#FF8C00]/25 bg-[#FFF8F0]",
    green: "border-emerald-200 bg-emerald-50",
    red: "border-red-200 bg-red-50",
    gray: "border-[#E2E8F0] bg-white",
  };
  const valueColor = {
    navy: "text-[#002D62]",
    orange: "text-[#E67E00]",
    green: "text-emerald-700",
    red: "text-red-700",
    gray: "text-[#002D62]",
  };
  return (
    <div className={`rounded-xl border p-3 shadow-sm sm:p-4 ${tones[tone]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5A6A7A] sm:text-xs">{label}</p>
      <p className={`mt-1 text-2xl font-bold sm:text-3xl ${valueColor[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-[#5A6A7A]">{hint}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#E2E8F0] bg-white shadow-sm ${className}`}>{children}</div>
  );
}

export function Badge({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: "gray" | "orange" | "navy" | "green" | "red";
}) {
  const map = {
    gray: "bg-[#F5F7FA] text-[#5A6A7A]",
    orange: "bg-[#FFF1E0] text-[#E67E00]",
    navy: "bg-[#E8EEF6] text-[#002D62]",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-[#002D62] text-white hover:bg-[#003d82]",
    secondary: "border border-[#E2E8F0] bg-white text-[#002D62] hover:border-[#FF8C00]",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-[#5A6A7A] hover:text-[#002D62] hover:bg-[#F5F7FA]",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5A6A7A]">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#002D62] outline-none focus:border-[#002D62] focus:ring-2 focus:ring-[#002D62]/15";

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto -mx-0">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] text-left text-xs uppercase tracking-wide text-[#5A6A7A]">
            {headers.map((h) => (
              <th key={h} className="px-3 py-3 font-semibold sm:px-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-3 align-top sm:px-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-6 text-center text-[#5A6A7A]">No records yet.</p>}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl ${
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 sm:px-5">
          <h2 className="text-lg font-bold text-[#002D62]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#5A6A7A] hover:bg-[#F5F7FA]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  actions,
}: {
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] px-4 py-3 sm:px-5">
      <h2 className="font-bold text-[#002D62]">{title}</h2>
      {actions}
    </div>
  );
}
