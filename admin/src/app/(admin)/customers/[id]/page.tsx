"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import {
  PageHeader,
  Card,
  Badge,
  DataTable,
  StatCard,
  Button,
  Modal,
  SectionHeader,
  Field,
  inputClass,
} from "@/components/ui";
import { BusinessForm, CustomerForm, LicenseForm, PaymentForm } from "@/components/forms";
import type { Business, Customer, DocumentRecord, LicenseRecord, Payment } from "@/lib/types";
import { DOCUMENT_TYPES, LICENSE_STATUS_LABELS } from "@/lib/types";
import {
  emptyBusiness,
  emptyLicense,
  emptyPayment,
  useStore,
} from "@/lib/store";
import { asset } from "@/lib/paths";

function licenseTone(status: string) {
  if (status === "Active") return "green" as const;
  if (status === "Expired") return "red" as const;
  if (status === "Pending Payment") return "orange" as const;
  return "navy" as const;
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    data,
    staffName,
    businessName,
    upsertCustomer,
    deleteCustomer,
    upsertBusiness,
    deleteBusiness,
    upsertLicense,
    deleteLicense,
    upsertPayment,
    deletePayment,
    addDocument,
    newId,
  } = useStore();

  const customer = data.customers.find((c) => c.id === id);

  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editBusiness, setEditBusiness] = useState<Business | null>(null);
  const [editLicense, setEditLicense] = useState<LicenseRecord | null>(null);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  if (!customer) {
    return (
      <div>
        <PageHeader title="Customer not found" />
        <Link href="/customers" className="font-semibold text-[#FF8C00]">
          ← Back to customers
        </Link>
      </div>
    );
  }

  const businesses = data.businesses.filter((b) => b.customerId === customer.id);
  const locations = data.locations.filter((l) => l.customerId === customer.id);
  const licenses = data.licenses.filter((l) => l.holderCustomerId === customer.id);
  const tasks = data.tasks.filter((t) => t.customerId === customer.id);
  const docs = data.documents.filter((d) => d.customerId === customer.id);
  const payments = data.payments.filter((p) => p.customerId === customer.id);
  const defaultBiz = businesses[0]?.id || "";
  const idDocs = docs.filter((d) => d.type === "Government ID");
  const licensePdfs = docs.filter((d) => d.type === "License PDF");

  const onUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    const name = String(fd.get("name") || file?.name || "Document");
    const type = String(fd.get("type") || "Other");
    const licenseId = String(fd.get("licenseId") || "") || undefined;
    if (!file) {
      setUploadMsg("Choose a file.");
      return;
    }
    setUploading(true);
    setUploadMsg("");
    let blobUrl = "";
    try {
      const uploadFd = new FormData();
      uploadFd.append("file", file);
      const res = await fetch(asset("/api/blob/upload"), { method: "POST", body: uploadFd });
      if (res.ok) {
        const json = await res.json();
        blobUrl = json.url || "";
      } else {
        blobUrl = URL.createObjectURL(file);
        setUploadMsg("Stored with local preview (Blob token may be unset).");
      }
    } catch {
      blobUrl = URL.createObjectURL(file);
      setUploadMsg("Demo local file URL created.");
    }

    const doc: DocumentRecord = {
      id: newId("doc"),
      name,
      type,
      customerId: customer.id,
      businessId: defaultBiz || undefined,
      licenseId,
      uploadedAt: new Date().toISOString().slice(0, 10),
      effectiveDate: new Date().toISOString().slice(0, 10),
      expirationDate: "",
      verifiedBy: "Pending",
      verificationStatus: "Pending",
      confidentiality: type === "Government ID" ? "Sensitive" : "Restricted",
      version: 1,
      blobUrl,
      notes: "",
    };
    addDocument(doc);
    setUploading(false);
    form.reset();
    setUploadOpen(false);
  };

  return (
    <div>
      <PageHeader
        title={customer.legalName}
        subtitle={`Assigned to ${staffName(customer.assignedStaffId)}`}
        actions={
          <>
            <Link href="/customers" className="text-sm font-semibold text-[#5A6A7A] hover:text-[#FF8C00]">
              ← Customers
            </Link>
            <Button variant="secondary" onClick={() => setEditCustomer({ ...customer })}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm(`Delete ${customer.legalName} and related records?`)) {
                  deleteCustomer(customer.id);
                  router.push("/customers");
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Businesses" value={businesses.length} />
        <StatCard label="Licenses" value={licenses.length} tone="orange" />
        <StatCard label="ID docs" value={idDocs.length} />
        <StatCard label="License PDFs" value={licensePdfs.length} tone="green" />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-bold">Owner information</h2>
            <Button variant="ghost" className="!px-2 !py-1" onClick={() => setEditCustomer({ ...customer })}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Preferred name", customer.preferredName],
              ["DOB", customer.dateOfBirth],
              ["Phone", customer.phone],
              ["Email", customer.email],
              ["ID type", customer.idType],
              ["ID expiration", customer.idExpiration],
              ["SSN last 4", customer.ssnLast4 ? `•••-${customer.ssnLast4}` : "—"],
              ["Citizenship", customer.citizenshipStatus],
              ["Language", customer.preferredLanguage],
              ["Best contact", customer.bestContactMethod],
              ["Emergency", customer.emergencyContact],
              ["Address", customer.residentialAddress],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase text-[#5A6A7A]">{k}</dt>
                <dd className="mt-0.5 break-words font-medium">{v || "—"}</dd>
              </div>
            ))}
          </dl>
          {customer.notes && (
            <p className="mt-4 border-t border-[#E2E8F0] pt-3 text-sm text-[#5A6A7A]">{customer.notes}</p>
          )}
        </Card>

        <Card>
          <SectionHeader
            title="Businesses"
            actions={
              <Button
                variant="secondary"
                className="!py-1.5"
                onClick={() => setEditBusiness(emptyBusiness(customer.id, newId("b")))}
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            }
          />
          <ul className="space-y-3 p-4">
            {businesses.length === 0 && <li className="text-sm text-[#5A6A7A]">No businesses yet.</li>}
            {businesses.map((b) => (
              <li key={b.id} className="rounded-lg border border-[#E2E8F0] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{b.legalName}</p>
                    <p className="text-xs text-[#5A6A7A]">
                      {b.entityType} · EIN {b.ein || "—"} · Doc {b.floridaDocNumber || "—"}
                    </p>
                    <p className="mt-1 text-xs text-[#5A6A7A]">
                      {b.industry} · {b.county || "—"} / {b.municipality || "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" className="!px-2 !py-1" onClick={() => setEditBusiness({ ...b })}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="!px-2 !py-1 text-red-600"
                      onClick={() => {
                        if (confirm("Delete this business?")) deleteBusiness(b.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {locations.length > 0 && (
        <Card className="mb-5">
          <SectionHeader title="Locations" />
          <DataTable
            headers={["Location", "Address", "Zoning / COU", "LBT", "Opening"]}
            rows={locations.map((l) => [
              <div key={l.id}>
                <p className="font-semibold">{l.name}</p>
                <p className="text-xs text-[#5A6A7A]">{businessName(l.businessId)}</p>
              </div>,
              `${l.address}`,
              `${l.zoningStatus} / ${l.certificateOfUse}`,
              l.localBusinessTax,
              l.openingStatus,
            ])}
          />
        </Card>
      )}

      <Card className="mb-5">
        <SectionHeader
          title="Licenses"
          actions={
            <Button
              variant="secondary"
              className="!py-1.5"
              onClick={() =>
                setEditLicense(emptyLicense(customer.id, defaultBiz, customer.assignedStaffId, newId("lic")))
              }
            >
              <Plus className="h-4 w-4" /> Add license
            </Button>
          }
        />
        <DataTable
          headers={["Type", "Status", "Issued", "Expires", ""]}
          rows={licenses.map((l) => [
            <div key={l.id}>
              <p className="font-semibold">{l.type}</p>
              <p className="text-xs text-[#5A6A7A]">
                {l.agency} · {l.licenseNumber || l.applicationNumber || "—"}
              </p>
            </div>,
            <Badge key={`${l.id}-s`} tone={licenseTone(l.status)}>
              {LICENSE_STATUS_LABELS[l.status] || l.status}
            </Badge>,
            l.issueDate || "—",
            l.expirationDate || "—",
            <div key={`${l.id}-a`} className="flex gap-1">
              <Button variant="ghost" className="!px-2 !py-1" onClick={() => setEditLicense({ ...l })}>
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
          ])}
        />
      </Card>

      <Card className="mb-5">
        <SectionHeader
          title="Secure files"
          actions={
            <Button variant="secondary" className="!py-1.5" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
          }
        />
        <div className="grid gap-3 border-b border-[#E2E8F0] p-4 sm:grid-cols-2">
          <div className="rounded-lg bg-[#F5F7FA] p-3 text-sm">
            <p className="font-semibold text-[#002D62]">Government ID</p>
            <p className="text-[#5A6A7A]">{idDocs.length} file(s) — client identity documents</p>
          </div>
          <div className="rounded-lg bg-[#F5F7FA] p-3 text-sm">
            <p className="font-semibold text-[#002D62]">License PDFs</p>
            <p className="text-[#5A6A7A]">{licensePdfs.length} file(s) — final issued licenses</p>
          </div>
        </div>
        <DataTable
          headers={["Document", "Type", "Status", "File"]}
          rows={docs.map((d) => [
            d.name,
            d.type,
            <Badge key={d.id} tone={d.verificationStatus === "Verified" ? "green" : "orange"}>
              {d.verificationStatus}
            </Badge>,
            d.blobUrl ? (
              <a href={d.blobUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#FF8C00]">
                Open
              </a>
            ) : (
              "—"
            ),
          ])}
        />
        {uploadMsg && <p className="px-4 pb-3 text-sm text-[#5A6A7A]">{uploadMsg}</p>}
      </Card>

      <Card className="mb-5">
        <SectionHeader
          title="Payments"
          actions={
            <Button
              variant="secondary"
              className="!py-1.5"
              onClick={() => setEditPayment(emptyPayment(customer.id, defaultBiz, newId("pay")))}
            >
              <Plus className="h-4 w-4" /> Add payment
            </Button>
          }
        />
        <DataTable
          headers={["Description", "Fees", "Paid", "Balance", "Status", ""]}
          rows={payments.map((p) => [
            p.description,
            `$${(p.serviceFee + p.governmentFee + p.inspectionFee).toLocaleString()}`,
            `$${p.amountPaid.toLocaleString()}`,
            `$${p.balance.toLocaleString()}`,
            <Badge key={p.id} tone={p.status === "Paid" ? "green" : p.status === "Due" ? "red" : "orange"}>
              {p.status}
            </Badge>,
            <div key={`${p.id}-a`} className="flex gap-1">
              <Button variant="ghost" className="!px-2 !py-1" onClick={() => setEditPayment({ ...p })}>
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

      <Card className="mb-5">
        <SectionHeader title="Tasks" />
        <DataTable headers={["Task", "Due", "Status"]} rows={tasks.map((t) => [t.title, t.dueDate, t.status])} />
      </Card>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload client file">
        <form className="space-y-3" onSubmit={onUpload}>
          <Field label="Document name">
            <input name="name" className={inputClass} placeholder="e.g. Driver license — Maria" />
          </Field>
          <Field label="Type *">
            <select name="type" className={inputClass} defaultValue="Government ID" required>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Link to license (optional)">
            <select name="licenseId" className={inputClass} defaultValue="">
              <option value="">—</option>
              {licenses.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.type}
                </option>
              ))}
            </select>
          </Field>
          <Field label="File *">
            <input name="file" type="file" required accept=".pdf,image/*" className="w-full text-sm" />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading…" : "Save file"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editCustomer} onClose={() => setEditCustomer(null)} title="Edit customer" wide>
        {editCustomer && (
          <CustomerForm
            value={editCustomer}
            staff={data.staff}
            onChange={setEditCustomer}
            onCancel={() => setEditCustomer(null)}
            submitLabel="Save changes"
            onSubmit={() => {
              upsertCustomer(editCustomer);
              setEditCustomer(null);
            }}
          />
        )}
      </Modal>

      <Modal
        open={!!editBusiness}
        onClose={() => setEditBusiness(null)}
        title={editBusiness && businesses.some((b) => b.id === editBusiness.id) ? "Edit business" : "Add business"}
        wide
      >
        {editBusiness && (
          <BusinessForm
            value={editBusiness}
            onChange={setEditBusiness}
            onCancel={() => setEditBusiness(null)}
            onSubmit={() => {
              upsertBusiness(editBusiness);
              setEditBusiness(null);
            }}
          />
        )}
      </Modal>

      <Modal open={!!editLicense} onClose={() => setEditLicense(null)} title="License" wide>
        {editLicense && (
          <LicenseForm
            value={editLicense}
            customers={data.customers}
            businesses={data.businesses}
            staff={data.staff}
            onChange={setEditLicense}
            onCancel={() => setEditLicense(null)}
            submitLabel="Save license"
            onSubmit={() => {
              upsertLicense(editLicense);
              setEditLicense(null);
            }}
          />
        )}
      </Modal>

      <Modal open={!!editPayment} onClose={() => setEditPayment(null)} title="Payment" wide>
        {editPayment && (
          <PaymentForm
            value={editPayment}
            customers={data.customers}
            businesses={data.businesses}
            onChange={setEditPayment}
            onCancel={() => setEditPayment(null)}
            submitLabel="Save payment"
            onSubmit={() => {
              upsertPayment(editPayment);
              setEditPayment(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
