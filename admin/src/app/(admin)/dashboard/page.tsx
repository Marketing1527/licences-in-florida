"use client";

import Link from "next/link";
import { PageHeader, StatCard, Card, Badge, DataTable } from "@/components/ui";
import { useStore, daysUntil } from "@/lib/store";
import { LICENSE_STATUS_LABELS, type LicenseStatus } from "@/lib/types";

function statusTone(status: LicenseStatus) {
  if (status === "Active") return "green" as const;
  if (status === "Expired") return "red" as const;
  if (status === "Pending Payment") return "orange" as const;
  return "navy" as const;
}

export default function DashboardPage() {
  const { metrics, data, staffName, customerName, businessName } = useStore();

  const byStatus = data.licenses.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Licenses, renewals, and what needs attention." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Customers" value={metrics.activeCustomers} tone="navy" />
        <StatCard label="Active licenses" value={byStatus["Active"] || 0} tone="green" />
        <StatCard label="In process" value={byStatus["In Process"] || 0} tone="orange" />
        <StatCard label="Expiring ≤60 days" value={metrics.expiring60} tone="red" />
        <StatCard label="Expired" value={byStatus["Expired"] || 0} tone="red" />
        <StatCard label="Pending payment" value={byStatus["Pending Payment"] || 0} tone="orange" />
        <StatCard label="Payments due" value={metrics.paymentsDue} tone="red" />
        <StatCard label="Inspections pending" value={metrics.inspectionsPending} tone="orange" />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 sm:px-5">
            <h2 className="font-bold">License status</h2>
            <Link href="/licenses" className="text-sm font-semibold text-[#FF8C00]">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
            {(Object.keys(LICENSE_STATUS_LABELS) as LicenseStatus[]).map((status) => (
              <div key={status} className="rounded-lg border border-[#E2E8F0] bg-[#F5F7FA] p-3">
                <p className="text-2xl font-bold text-[#002D62]">{byStatus[status] || 0}</p>
                <p className="mt-1 text-xs font-semibold text-[#5A6A7A]">{LICENSE_STATUS_LABELS[status]}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="border-b border-[#E2E8F0] px-4 py-3 sm:px-5">
            <h2 className="font-bold">Renewal alarms</h2>
            <p className="text-xs text-[#5A6A7A]">Based on issue &amp; expiration dates</p>
          </div>
          <DataTable
            headers={["License", "Customer", "Expires", "Days"]}
            rows={data.licenses
              .map((l) => ({ l, days: daysUntil(l.expirationDate) }))
              .filter((x) => x.days !== null && x.days <= 120)
              .sort((a, b) => (a.days ?? 999) - (b.days ?? 999))
              .slice(0, 8)
              .map(({ l, days }) => [
                <div key={l.id}>
                  <p className="font-semibold">{l.type}</p>
                  <p className="text-xs text-[#5A6A7A]">Issued {l.issueDate || "—"}</p>
                </div>,
                customerName(l.holderCustomerId),
                l.expirationDate || "—",
                <span key={`${l.id}-d`} className={days !== null && days <= 60 ? "font-bold text-red-600" : ""}>
                  {days}d
                </span>,
              ])}
          />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex justify-between border-b border-[#E2E8F0] px-4 py-3 sm:px-5">
            <h2 className="font-bold">Open tasks</h2>
            <Link href="/tasks" className="text-sm font-semibold text-[#FF8C00]">
              Tasks
            </Link>
          </div>
          <DataTable
            headers={["Task", "Assignee", "Due", "Priority"]}
            rows={data.tasks
              .filter((t) => t.status !== "Done")
              .slice(0, 8)
              .map((t) => [
                <div key={t.id}>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-[#5A6A7A]">{t.type}</p>
                </div>,
                staffName(t.assignedStaffId),
                t.dueDate,
                <Badge key={t.priority} tone={t.priority === "Urgent" || t.priority === "High" ? "red" : "gray"}>
                  {t.priority}
                </Badge>,
              ])}
          />
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 sm:px-5">
            <h2 className="font-bold">Licenses overview</h2>
            <Link href="/licenses" className="text-sm font-semibold text-[#FF8C00]">
              Manage
            </Link>
          </div>
          <DataTable
            headers={["License", "Business", "Status", "Expires"]}
            rows={data.licenses.slice(0, 8).map((l) => [
              <div key={l.id}>
                <p className="font-semibold">{l.type}</p>
                <p className="text-xs text-[#5A6A7A]">{l.licenseNumber || l.applicationNumber}</p>
              </div>,
              businessName(l.businessId),
              <Badge key={l.status} tone={statusTone(l.status)}>
                {LICENSE_STATUS_LABELS[l.status] || l.status}
              </Badge>,
              l.expirationDate || "—",
            ])}
          />
        </Card>
      </div>
    </div>
  );
}
