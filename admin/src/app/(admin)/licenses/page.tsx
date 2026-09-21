"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader, Card, DataTable, Badge, Button, Modal } from "@/components/ui";
import { LicenseForm } from "@/components/forms";
import type { LicenseRecord } from "@/lib/types";
import { LICENSE_STATUS_LABELS } from "@/lib/types";
import { emptyLicense, useStore, daysUntil } from "@/lib/store";

function tone(status: string) {
  if (status === "Active") return "green" as const;
  if (status === "Expired") return "red" as const;
  if (status === "Pending Payment") return "orange" as const;
  return "navy" as const;
}

export default function LicensesPage() {
  const { data, customerName, businessName, staffName, upsertLicense, deleteLicense, newId } = useStore();
  const [draft, setDraft] = useState<LicenseRecord | null>(null);

  return (
    <div>
      <PageHeader
        title="Licenses"
        subtitle="Track every permit and renewal in one place."
        actions={
          <Button
            onClick={() =>
              setDraft(
                emptyLicense(
                  data.customers[0]?.id || "",
                  data.businesses.find((b) => b.customerId === data.customers[0]?.id)?.id || "",
                  data.staff[0]?.id || "s1",
                  newId("lic")
                )
              )
            }
          >
            <Plus className="h-4 w-4" /> Add license
          </Button>
        }
      />
      <Card>
        <DataTable
          headers={["License", "Agency", "Holder", "Status", "Issued", "Expires", ""]}
          rows={data.licenses.map((l) => {
            const days = daysUntil(l.expirationDate);
            return [
              <div key={l.id}>
                <p className="font-semibold">{l.type}</p>
                <p className="text-xs text-[#5A6A7A]">
                  {l.licenseNumber || l.applicationNumber || "—"} · {l.category}
                </p>
              </div>,
              `${l.agency} · ${l.jurisdiction}`,
              <div key={`${l.id}-h`}>
                <p>{customerName(l.holderCustomerId)}</p>
                <p className="text-xs text-[#5A6A7A]">{businessName(l.businessId)}</p>
              </div>,
              <Badge key={l.status} tone={tone(l.status)}>
                {LICENSE_STATUS_LABELS[l.status] || l.status}
              </Badge>,
              l.issueDate || "—",
              <div key={`${l.id}-e`}>
                <p>{l.expirationDate || "—"}</p>
                {days !== null && (
                  <p className={`text-xs ${days <= 60 ? "font-semibold text-red-600" : "text-[#5A6A7A]"}`}>
                    {days}d left
                  </p>
                )}
              </div>,
              <div key={`${l.id}-a`} className="flex gap-1">
                <Button variant="ghost" className="!px-2 !py-1" onClick={() => setDraft({ ...l })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-red-600"
                  onClick={() => {
                    if (confirm("Delete this license?")) deleteLicense(l.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>,
            ];
          })}
        />
      </Card>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="License" wide>
        {draft && (
          <LicenseForm
            value={draft}
            customers={data.customers}
            businesses={data.businesses}
            staff={data.staff}
            onChange={setDraft}
            onCancel={() => setDraft(null)}
            submitLabel="Save license"
            onSubmit={() => {
              upsertLicense(draft);
              setDraft(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
