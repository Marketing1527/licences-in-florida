"use client";

import type { Business, Customer, LicenseRecord, Payment } from "@/lib/types";
import {
  ENTITY_TYPES,
  JURISDICTIONS,
  LICENSE_STATUSES,
  LICENSE_STATUS_LABELS,
  PAYMENT_STATUSES,
} from "@/lib/types";
import { calcPaymentBalance } from "@/lib/store";
import { Button, Field, inputClass } from "@/components/ui";

export function CustomerForm({
  value,
  staff,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  value: Customer;
  staff: { id: string; name: string }[];
  onChange: (c: Customer) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const set = <K extends keyof Customer>(key: K, v: Customer[K]) => onChange({ ...value, [key]: v });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Legal name *">
          <input required className={inputClass} value={value.legalName} onChange={(e) => set("legalName", e.target.value)} />
        </Field>
        <Field label="Preferred name">
          <input className={inputClass} value={value.preferredName} onChange={(e) => set("preferredName", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={value.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className={inputClass} value={value.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Date of birth">
          <input type="date" className={inputClass} value={value.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
        </Field>
        <Field label="Best contact method">
          <select className={inputClass} value={value.bestContactMethod} onChange={(e) => set("bestContactMethod", e.target.value)}>
            {["Phone", "Email", "WhatsApp", "Text"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Language">
          <input className={inputClass} value={value.preferredLanguage} onChange={(e) => set("preferredLanguage", e.target.value)} />
        </Field>
        <Field label="Assigned staff">
          <select className={inputClass} value={value.assignedStaffId} onChange={(e) => set("assignedStaffId", e.target.value)}>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ID type">
          <input className={inputClass} value={value.idType} onChange={(e) => set("idType", e.target.value)} />
        </Field>
        <Field label="ID expiration">
          <input type="date" className={inputClass} value={value.idExpiration} onChange={(e) => set("idExpiration", e.target.value)} />
        </Field>
        <Field label="SSN last 4">
          <input className={inputClass} maxLength={4} value={value.ssnLast4} onChange={(e) => set("ssnLast4", e.target.value)} />
        </Field>
        <Field label="Citizenship">
          <input className={inputClass} value={value.citizenshipStatus} onChange={(e) => set("citizenshipStatus", e.target.value)} />
        </Field>
        <Field label="Emergency contact">
          <input className={inputClass} value={value.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} />
        </Field>
      </div>
      <Field label="Residential address">
        <input className={inputClass} value={value.residentialAddress} onChange={(e) => set("residentialAddress", e.target.value)} />
      </Field>
      <Field label="Notes">
        <textarea className={`${inputClass} min-h-[80px]`} value={value.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export function BusinessForm({
  value,
  onChange,
  onSubmit,
  onCancel,
}: {
  value: Business;
  onChange: (b: Business) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const set = <K extends keyof Business>(key: K, v: Business[K]) => onChange({ ...value, [key]: v });
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Legal name *">
          <input required className={inputClass} value={value.legalName} onChange={(e) => set("legalName", e.target.value)} />
        </Field>
        <Field label="DBA">
          <input className={inputClass} value={value.dba} onChange={(e) => set("dba", e.target.value)} />
        </Field>
        <Field label="Entity type">
          <select className={inputClass} value={value.entityType} onChange={(e) => set("entityType", e.target.value as Business["entityType"])}>
            {ENTITY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Industry">
          <input className={inputClass} value={value.industry} onChange={(e) => set("industry", e.target.value)} />
        </Field>
        <Field label="EIN">
          <input className={inputClass} value={value.ein} onChange={(e) => set("ein", e.target.value)} />
        </Field>
        <Field label="Sunbiz doc #">
          <input className={inputClass} value={value.floridaDocNumber} onChange={(e) => set("floridaDocNumber", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={value.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={value.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="County">
          <input className={inputClass} value={value.county} onChange={(e) => set("county", e.target.value)} />
        </Field>
        <Field label="Municipality">
          <input className={inputClass} value={value.municipality} onChange={(e) => set("municipality", e.target.value)} />
        </Field>
      </div>
      <Field label="Mailing address">
        <input className={inputClass} value={value.mailingAddress} onChange={(e) => set("mailingAddress", e.target.value)} />
      </Field>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save business</Button>
      </div>
    </form>
  );
}

export function LicenseForm({
  value,
  customers,
  businesses,
  staff,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  value: LicenseRecord;
  customers: Customer[];
  businesses: Business[];
  staff: { id: string; name: string }[];
  onChange: (l: LicenseRecord) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const set = <K extends keyof LicenseRecord>(key: K, v: LicenseRecord[K]) => onChange({ ...value, [key]: v });
  const customerBusinesses = businesses.filter((b) => b.customerId === value.holderCustomerId);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Customer *">
          <select
            required
            className={inputClass}
            value={value.holderCustomerId}
            onChange={(e) => {
              const cid = e.target.value;
              const firstBiz = businesses.find((b) => b.customerId === cid);
              onChange({ ...value, holderCustomerId: cid, businessId: firstBiz?.id || "" });
            }}
          >
            <option value="">Select…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.legalName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Business">
          <select className={inputClass} value={value.businessId} onChange={(e) => set("businessId", e.target.value)}>
            <option value="">Select…</option>
            {customerBusinesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.legalName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="License type *">
          <input required className={inputClass} value={value.type} onChange={(e) => set("type", e.target.value)} placeholder="e.g. AHCA Health Care Clinic" />
        </Field>
        <Field label="Category">
          <input className={inputClass} value={value.category} onChange={(e) => set("category", e.target.value)} />
        </Field>
        <Field label="Agency">
          <input className={inputClass} value={value.agency} onChange={(e) => set("agency", e.target.value)} />
        </Field>
        <Field label="Jurisdiction">
          <select className={inputClass} value={value.jurisdiction} onChange={(e) => set("jurisdiction", e.target.value as LicenseRecord["jurisdiction"])}>
            {JURISDICTIONS.map((j) => (
              <option key={j}>{j}</option>
            ))}
          </select>
        </Field>
        <Field label="License status *">
          <select className={inputClass} value={value.status} onChange={(e) => set("status", e.target.value as LicenseRecord["status"])}>
            {LICENSE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LICENSE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Assigned staff">
          <select className={inputClass} value={value.assignedStaffId} onChange={(e) => set("assignedStaffId", e.target.value)}>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="License #">
          <input className={inputClass} value={value.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} />
        </Field>
        <Field label="Application #">
          <input className={inputClass} value={value.applicationNumber} onChange={(e) => set("applicationNumber", e.target.value)} />
        </Field>
        <Field label="Issue date">
          <input type="date" className={inputClass} value={value.issueDate} onChange={(e) => set("issueDate", e.target.value)} />
        </Field>
        <Field label="Expiration date *">
          <input required type="date" className={inputClass} value={value.expirationDate} onChange={(e) => set("expirationDate", e.target.value)} />
        </Field>
        <Field label="Renewal deadline">
          <input type="date" className={inputClass} value={value.renewalDeadline} onChange={(e) => set("renewalDeadline", e.target.value)} />
        </Field>
        <Field label="Next action date">
          <input type="date" className={inputClass} value={value.nextActionDate} onChange={(e) => set("nextActionDate", e.target.value)} />
        </Field>
        <Field label="Fee ($)">
          <input type="number" min={0} className={inputClass} value={value.fee} onChange={(e) => set("fee", Number(e.target.value) || 0)} />
        </Field>
        <Field label="Renewal frequency">
          <input className={inputClass} value={value.renewalFrequency} onChange={(e) => set("renewalFrequency", e.target.value)} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea className={`${inputClass} min-h-[72px]`} value={value.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export function PaymentForm({
  value,
  customers,
  businesses,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  value: Payment;
  customers: Customer[];
  businesses: Business[];
  onChange: (p: Payment) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const update = (patch: Partial<Payment>) => {
    const next = { ...value, ...patch };
    next.balance = calcPaymentBalance(next);
    if (next.balance === 0 && next.amountPaid > 0) next.status = "Paid";
    else if (next.amountPaid > 0 && next.balance > 0) next.status = "Partial";
    onChange(next);
  };
  const customerBusinesses = businesses.filter((b) => b.customerId === value.customerId);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Customer *">
          <select
            required
            className={inputClass}
            value={value.customerId}
            onChange={(e) => {
              const cid = e.target.value;
              const firstBiz = businesses.find((b) => b.customerId === cid);
              update({ customerId: cid, businessId: firstBiz?.id || "" });
            }}
          >
            <option value="">Select…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.legalName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Business">
          <select className={inputClass} value={value.businessId} onChange={(e) => update({ businessId: e.target.value })}>
            <option value="">Select…</option>
            {customerBusinesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.legalName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description *" className="sm:col-span-2">
          <input required className={inputClass} value={value.description} onChange={(e) => update({ description: e.target.value })} />
        </Field>
        <Field label="Service fee ($)">
          <input type="number" min={0} className={inputClass} value={value.serviceFee} onChange={(e) => update({ serviceFee: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Government fee ($)">
          <input type="number" min={0} className={inputClass} value={value.governmentFee} onChange={(e) => update({ governmentFee: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Inspection fee ($)">
          <input type="number" min={0} className={inputClass} value={value.inspectionFee} onChange={(e) => update({ inspectionFee: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Amount paid ($)">
          <input type="number" min={0} className={inputClass} value={value.amountPaid} onChange={(e) => update({ amountPaid: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Status">
          <select className={inputClass} value={value.status} onChange={(e) => update({ status: e.target.value as Payment["status"] })}>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Payment date">
          <input type="date" className={inputClass} value={value.paymentDate} onChange={(e) => update({ paymentDate: e.target.value })} />
        </Field>
        <Field label="Method">
          <input className={inputClass} value={value.method} onChange={(e) => update({ method: e.target.value })} placeholder="Check, Zelle, Card…" />
        </Field>
        <Field label="Receipt / ref #">
          <input className={inputClass} value={value.receipt} onChange={(e) => update({ receipt: e.target.value })} />
        </Field>
      </div>
      <p className="rounded-lg bg-[#F5F7FA] px-3 py-2 text-sm text-[#5A6A7A]">
        Balance due: <span className="font-bold text-[#002D62]">${value.balance.toLocaleString()}</span>
        <span className="ml-2 text-xs">(QuickBooks invoicing coming later)</span>
      </p>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
