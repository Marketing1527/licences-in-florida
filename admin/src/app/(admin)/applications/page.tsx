"use client";

import { PageHeader, Card, DataTable, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function ApplicationsPage() {
  const { data, customerName, businessName, staffName } = useStore();
  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Application workspaces with checklists, signatures, and deficiency tracking."
      />
      <Card className="mb-6">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-bold">Active applications</h2>
        </div>
        <DataTable
          headers={["Application", "Customer / Business", "Status", "Submitted", "Assignee"]}
          rows={data.applications.map((a) => [
            <div key={a.id}>
              <p className="font-semibold">{a.title}</p>
              <p className="text-xs text-[#5A6A7A]">
                {a.formName} · {a.formVersion}
              </p>
            </div>,
            <div key={`${a.id}-c`}>
              <p>{customerName(a.customerId)}</p>
              <p className="text-xs text-[#5A6A7A]">{businessName(a.businessId)}</p>
            </div>,
            <Badge
              key={a.status}
              tone={a.status.includes("Deficiency") || a.status.includes("correction") ? "red" : "navy"}
            >
              {a.status}
            </Badge>,
            a.submissionDate || "—",
            staffName(a.assignedStaffId),
          ])}
        />
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-bold">Deficiencies & corrections</h2>
        </div>
        <DataTable
          headers={["Agency", "Items requested", "Deadline", "Staff", "Outcome"]}
          rows={data.deficiencies.map((d) => [
            d.agency,
            d.itemsRequested,
            <span key={d.id} className="font-semibold text-red-600">
              {d.responseDeadline}
            </span>,
            staffName(d.responsibleStaffId),
            <Badge key={d.outcome} tone="red">
              {d.outcome}
            </Badge>,
          ])}
        />
      </Card>

      {data.applications.map((a) => (
        <Card key={a.id} className="mt-6 p-5">
          <h3 className="font-bold mb-3">Checklist — {a.title}</h3>
          <ul className="grid sm:grid-cols-2 gap-2">
            {a.checklist.map((item) => (
              <li
                key={item.item}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  item.done ? "border-emerald-200 bg-emerald-50" : "border-[#E2E8F0] bg-[#F5F7FA]"
                }`}
              >
                {item.done ? "✓" : "○"} {item.item}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
