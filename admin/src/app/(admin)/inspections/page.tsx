"use client";

import { PageHeader, Card, DataTable, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function InspectionsPage() {
  const { data, businessName } = useStore();
  return (
    <div>
      <PageHeader
        title="Inspections"
        subtitle="City/county inspections with folio, invoice, schedule, results, and reinspections."
      />
      <Card>
        <DataTable
          headers={["Type / Agency", "Business / Folio", "Invoice", "Scheduled", "Fee", "Status"]}
          rows={data.inspections.map((i) => [
            <div key={i.id}>
              <p className="font-semibold">{i.type}</p>
              <p className="text-xs text-[#5A6A7A]">{i.agency}</p>
            </div>,
            <div key={`${i.id}-b`}>
              <p>{businessName(i.businessId)}</p>
              <p className="text-xs text-[#5A6A7A]">Folio {i.folio}</p>
              <p className="text-xs text-[#5A6A7A]">Permit {i.permitNumber}</p>
            </div>,
            i.invoiceNumber,
            i.scheduledDate.replace("T", " "),
            `$${i.fee} · ${i.paymentStatus}`,
            <Badge key={i.status} tone="orange">
              {i.status}
            </Badge>,
          ])}
        />
      </Card>
      <Card className="mt-6 p-5">
        <h2 className="font-bold mb-2">Inspection workflow</h2>
        <p className="text-sm text-[#5A6A7A]">
          Not requested → Requested → Fee due → Scheduled → Completed → Corrections required → Reinspection → Passed
        </p>
      </Card>
    </div>
  );
}
