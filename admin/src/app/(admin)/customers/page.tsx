"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader, Card, Badge, DataTable, Button, Modal, inputClass } from "@/components/ui";
import { CustomerForm } from "@/components/forms";
import { emptyCustomer, useStore } from "@/lib/store";

export default function CustomersPage() {
  const { data, staffName, upsertCustomer, newId } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => emptyCustomer(data.staff[0]?.id || "s1", "tmp"));

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data.customers;
    return data.customers.filter(
      (c) =>
        c.legalName.toLowerCase().includes(term) ||
        c.preferredName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
    );
  }, [data.customers, q]);

  const startAdd = () => {
    setDraft(emptyCustomer(data.staff[0]?.id || "s1", newId("c")));
    setOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Central client records — licenses, payments, and businesses live here."
        actions={
          <Button onClick={startAdd}>
            <Plus className="h-4 w-4" /> Add customer
          </Button>
        }
      />

      <div className="mb-4 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
        <input
          className={`${inputClass} pl-9`}
          placeholder="Search name, phone, email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Card>
        <DataTable
          headers={["Customer", "Contact", "Licenses", "Assigned", ""]}
          rows={filtered.map((c) => {
            const licCount = data.licenses.filter((l) => l.holderCustomerId === c.id).length;
            return [
              <div key={c.id}>
                <Link href={`/customers/${c.id}`} className="font-semibold text-[#002D62] hover:text-[#FF8C00]">
                  {c.legalName}
                </Link>
                {c.preferredName && (
                  <p className="text-xs text-[#5A6A7A]">Prefers {c.preferredName}</p>
                )}
              </div>,
              <div key={`${c.id}-c`}>
                <p>{c.phone || "—"}</p>
                <p className="text-xs text-[#5A6A7A] break-all">{c.email || "—"}</p>
              </div>,
              <Badge key={`${c.id}-l`} tone="navy">
                {licCount} license{licCount === 1 ? "" : "s"}
              </Badge>,
              staffName(c.assignedStaffId),
              <Link key={`${c.id}-a`} href={`/customers/${c.id}`} className="text-sm font-semibold text-[#FF8C00]">
                Open
              </Link>,
            ];
          })}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add customer" wide>
        <CustomerForm
          value={draft}
          staff={data.staff}
          onChange={setDraft}
          onCancel={() => setOpen(false)}
          submitLabel="Create customer"
          onSubmit={() => {
            if (!draft.legalName.trim()) return;
            upsertCustomer(draft);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
