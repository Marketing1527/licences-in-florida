"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader, Card, DataTable, Badge, StatCard, Button, Modal } from "@/components/ui";
import { PaymentForm } from "@/components/forms";
import type { Payment } from "@/lib/types";
import { emptyPayment, useStore } from "@/lib/store";

export default function PaymentsPage() {
  const { data, customerName, businessName, upsertPayment, deletePayment, newId } = useStore();
  const [draft, setDraft] = useState<Payment | null>(null);

  const serviceTotal = data.payments.reduce((s, p) => s + p.serviceFee, 0);
  const govTotal = data.payments.reduce((s, p) => s + p.governmentFee + p.inspectionFee, 0);
  const due = data.payments.reduce((s, p) => s + p.balance, 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Service fees vs government fees. QuickBooks invoicing comes next."
        actions={
          <Button
            onClick={() =>
              setDraft(
                emptyPayment(
                  data.customers[0]?.id || "",
                  data.businesses.find((b) => b.customerId === data.customers[0]?.id)?.id || "",
                  newId("pay")
                )
              )
            }
          >
            <Plus className="h-4 w-4" /> Add payment
          </Button>
        }
      />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Service fees" value={`$${serviceTotal.toLocaleString()}`} tone="navy" />
        <StatCard label="Gov / inspection" value={`$${govTotal.toLocaleString()}`} tone="orange" />
        <StatCard label="Outstanding" value={`$${due.toLocaleString()}`} tone="red" />
      </div>
      <Card>
        <DataTable
          headers={["Description", "Customer", "Service", "Gov/Insp", "Paid", "Balance", "Status", ""]}
          rows={data.payments.map((p) => [
            <div key={p.id}>
              <p className="font-semibold">{p.description}</p>
              <p className="text-xs text-[#5A6A7A]">
                {p.receipt || "No receipt"} · {p.method || "—"}
              </p>
            </div>,
            <div key={`${p.id}-c`}>
              <p>{customerName(p.customerId)}</p>
              <p className="text-xs text-[#5A6A7A]">{businessName(p.businessId)}</p>
            </div>,
            `$${p.serviceFee}`,
            `$${p.governmentFee + p.inspectionFee}`,
            `$${p.amountPaid}`,
            `$${p.balance}`,
            <Badge key={p.status} tone={p.status === "Paid" ? "green" : p.status === "Due" ? "red" : "orange"}>
              {p.status}
            </Badge>,
            <div key={`${p.id}-a`} className="flex gap-1">
              <Button variant="ghost" className="!px-2 !py-1" onClick={() => setDraft({ ...p })}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                className="!px-2 !py-1 text-red-600"
                onClick={() => {
                  if (confirm("Delete this payment?")) deletePayment(p.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>,
          ])}
        />
      </Card>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="Payment" wide>
        {draft && (
          <PaymentForm
            value={draft}
            customers={data.customers}
            businesses={data.businesses}
            onChange={setDraft}
            onCancel={() => setDraft(null)}
            submitLabel="Save payment"
            onSubmit={() => {
              upsertPayment(draft);
              setDraft(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
