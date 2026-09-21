"use client";

import { FormEvent, useState } from "react";
import { PageHeader, Card, DataTable, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { DocumentRecord } from "@/lib/types";
import { asset } from "@/lib/paths";

export default function DocumentsPage() {
  const { data, addDocument, customerName } = useStore();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    const name = String(fd.get("name") || file?.name || "Document");
    const type = String(fd.get("type") || "Other");
    const customerId = String(fd.get("customerId") || "");

    if (!file) {
      setMessage("Choose a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");
    let blobUrl = "";

    try {
      const uploadFd = new FormData();
      uploadFd.append("file", file);
      const res = await fetch(asset("/api/blob/upload"), { method: "POST", body: uploadFd });
      if (res.ok) {
        const json = await res.json();
        blobUrl = json.url || "";
      } else {
        const json = await res.json().catch(() => ({}));
        // Fallback local object URL when Blob token not configured
        blobUrl = URL.createObjectURL(file);
        setMessage(json.error || "Blob token not set — stored locally in session for demo.");
      }
    } catch {
      blobUrl = URL.createObjectURL(file);
      setMessage("Upload API unavailable — demo local preview URL created.");
    }

    const doc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      name,
      type,
      customerId: customerId || undefined,
      uploadedAt: new Date().toISOString().slice(0, 10),
      effectiveDate: new Date().toISOString().slice(0, 10),
      expirationDate: "",
      verifiedBy: "Pending",
      verificationStatus: "Pending",
      confidentiality: "Restricted",
      version: 1,
      blobUrl,
      notes: "Uploaded via admin Documents module",
    };
    addDocument(doc);
    setUploading(false);
    form.reset();
    if (!message) setMessage("Document added. Versioning preserves prior copies — use Replace Expired for renewals.");
  };

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Secure storage for license PDFs, government IDs, and supporting files."
      />

      <Card className="p-5 mb-6">
        <h2 className="font-bold mb-3">Upload document (Vercel Blob)</h2>
        <form onSubmit={onUpload} className="grid md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs font-semibold uppercase text-[#5A6A7A]">Name</label>
            <input name="name" className="mt-1 w-full rounded-lg border border-[#E2E8F0] px-3 py-2" placeholder="Document name" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-[#5A6A7A]">Type</label>
            <select name="type" className="mt-1 w-full rounded-lg border border-[#E2E8F0] px-3 py-2">
              <option>License PDF</option>
              <option>Government ID</option>
              <option>Lease</option>
              <option>EIN letter</option>
              <option>Articles of organization or incorporation</option>
              <option>Certificate of use</option>
              <option>Insurance certificate</option>
              <option>Bank statement</option>
              <option>Deficiency letter</option>
              <option>Floor plan</option>
              <option>Application</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-[#5A6A7A]">Customer</label>
            <select name="customerId" className="mt-1 w-full rounded-lg border border-[#E2E8F0] px-3 py-2">
              <option value="">—</option>
              {data.customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legalName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-[#5A6A7A]">File</label>
            <input name="file" type="file" required className="mt-1 w-full text-sm" />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="md:col-span-4 rounded-xl bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-2.5 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload to Blob / Add record"}
          </button>
        </form>
        {message && <p className="text-sm text-[#5A6A7A] mt-3">{message}</p>}
      </Card>

      <Card>
        <DataTable
          headers={["Document", "Type", "Customer", "Confidentiality", "Status", "Version", "File"]}
          rows={data.documents.map((d) => [
            <div key={d.id}>
              <p className="font-semibold">{d.name}</p>
              <p className="text-xs text-[#5A6A7A]">Uploaded {d.uploadedAt}</p>
            </div>,
            d.type,
            d.customerId ? customerName(d.customerId) : "—",
            d.confidentiality,
            <Badge key={d.verificationStatus} tone={d.verificationStatus === "Verified" ? "green" : "orange"}>
              {d.verificationStatus}
            </Badge>,
            `v${d.version}`,
            d.blobUrl ? (
              <a href={d.blobUrl} target="_blank" rel="noreferrer" className="text-[#FF8C00] font-semibold text-xs">
                Open
              </a>
            ) : (
              "—"
            ),
          ])}
        />
      </Card>
    </div>
  );
}
