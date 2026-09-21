"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SEED_DATA } from "./seed";
import type {
  AdminData,
  Business,
  Customer,
  DocumentRecord,
  LicenseRecord,
  Payment,
  Task,
} from "./types";
import { normalizeLicenseStatus } from "./types";
import { addDays, differenceInCalendarDays, parseISO, isValid } from "date-fns";

const STORAGE_KEY = "lif-admin-data-v3";
const AUTH_KEY = "lif-admin-auth";

type AuthState = { email: string; name: string } | null;

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

interface StoreContextValue {
  data: AdminData;
  auth: AuthState;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setData: React.Dispatch<React.SetStateAction<AdminData>>;
  addDocument: (doc: DocumentRecord) => void;
  upsertCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  upsertBusiness: (business: Business) => void;
  deleteBusiness: (id: string) => void;
  upsertLicense: (license: LicenseRecord) => void;
  deleteLicense: (id: string) => void;
  upsertPayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  upsertTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  newId: (prefix: string) => string;
  staffName: (id: string) => string;
  customerName: (id: string) => string;
  businessName: (id: string) => string;
  metrics: ReturnType<typeof computeMetrics>;
}

function computeMetrics(data: AdminData) {
  const today = new Date();
  const expiring = (days: number) =>
    data.licenses.filter((l) => {
      if (!l.expirationDate) return false;
      const d = parseISO(l.expirationDate);
      if (!isValid(d)) return false;
      const diff = differenceInCalendarDays(d, today);
      return diff >= 0 && diff <= days;
    }).length;

  const missingDocs = data.customers.filter((c) => c.pipelineStage === "Documents Needed").length;
  const inspectionsPending = data.inspections.filter(
    (i) =>
      ["Requested", "Fee due", "Scheduled", "Corrections required", "Reinspection"].includes(i.status) ||
      i.status === "Scheduled"
  ).length;
  const paymentsDue = data.payments.filter((p) => p.status === "Due" || p.status === "Partial").length;
  const corrections = data.applications.filter((a) => a.status === "Deficiency or correction received").length;
  const renewalsAwaiting = data.licenses.filter((l) => {
    const days = l.expirationDate ? differenceInCalendarDays(parseISO(l.expirationDate), today) : null;
    return days !== null && days >= 0 && days <= 90 && l.status === "Active";
  }).length;
  const waitingResponse = data.tasks.filter((t) => t.clientVisible && t.status !== "Done").length;
  const recentlyIssued = data.licenses.filter((l) => l.status === "Active").length;
  const inProgress = data.licenses.filter((l) => l.status === "In Process").length;

  const pipeline = data.customers.reduce<Record<string, number>>((acc, c) => {
    acc[c.pipelineStage] = (acc[c.pipelineStage] || 0) + 1;
    return acc;
  }, {});

  const tasksByStaff = data.staff.map((s) => ({
    staff: s,
    open: data.tasks.filter((t) => t.assignedStaffId === s.id && t.status !== "Done").length,
  }));

  return {
    activeCustomers: data.customers.length,
    inProgress,
    expiring30: expiring(30),
    expiring60: expiring(60),
    expiring90: expiring(90),
    expiring120: expiring(120),
    missingDocs,
    inspectionsPending,
    paymentsDue,
    corrections,
    renewalsAwaiting,
    waitingResponse,
    recentlyIssued,
    pipeline,
    tasksByStaff,
    upcomingReminders: data.reminders.filter((r) => r.status !== "Acknowledged").slice(0, 8),
  };
}

const StoreContext = createContext<StoreContextValue | null>(null);

function migrateData(raw: AdminData): AdminData {
  return {
    ...raw,
    licenses: (raw.licenses || []).map((l) => ({
      ...l,
      status: normalizeLicenseStatus(String(l.status || "In Process")),
    })),
  };
}

function loadStoredData(): AdminData | null {
  try {
    for (const key of [STORAGE_KEY, "lif-admin-data-v2", "lif-admin-data-v1"]) {
      const raw = localStorage.getItem(key);
      if (raw) return migrateData(JSON.parse(raw) as AdminData);
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData>(SEED_DATA);
  const [auth, setAuth] = useState<AuthState>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = loadStoredData();
      if (stored) setData(stored);
      const a = localStorage.getItem(AUTH_KEY);
      if (a) setAuth(JSON.parse(a) as AuthState);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const login = (email: string, password: string) => {
    if (
      (email === "admin@licencesinflorida.com" && password === "Licenses2026!") ||
      (email === "admin" && password === "admin")
    ) {
      const session = { email, name: "Admin User" };
      setAuth(session);
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const upsert =
    <T extends { id: string }>(key: keyof AdminData) =>
    (item: T) => {
      setData((prev) => {
        const list = prev[key] as unknown as T[];
        const idx = list.findIndex((x) => x.id === item.id);
        const next = [...list];
        if (idx >= 0) next[idx] = item;
        else next.unshift(item);
        return { ...prev, [key]: next };
      });
    };

  const remove =
    (key: keyof AdminData) =>
    (id: string) => {
      setData((prev) => ({
        ...prev,
        [key]: (prev[key] as { id: string }[]).filter((x) => x.id !== id),
      }));
    };

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      auth,
      login,
      logout,
      setData,
      addDocument: (doc) => setData((prev) => ({ ...prev, documents: [doc, ...prev.documents] })),
      upsertCustomer: upsert<Customer>("customers"),
      deleteCustomer: (id) => {
        setData((prev) => ({
          ...prev,
          customers: prev.customers.filter((c) => c.id !== id),
          businesses: prev.businesses.filter((b) => b.customerId !== id),
          locations: prev.locations.filter((l) => l.customerId !== id),
          licenses: prev.licenses.filter((l) => l.holderCustomerId !== id),
          payments: prev.payments.filter((p) => p.customerId !== id),
          tasks: prev.tasks.filter((t) => t.customerId !== id),
          documents: prev.documents.filter((d) => d.customerId !== id),
          applications: prev.applications.filter((a) => a.customerId !== id),
          inspections: prev.inspections.filter((i) => i.customerId !== id),
        }));
      },
      upsertBusiness: upsert<Business>("businesses"),
      deleteBusiness: remove("businesses"),
      upsertLicense: upsert<LicenseRecord>("licenses"),
      deleteLicense: remove("licenses"),
      upsertPayment: upsert<Payment>("payments"),
      deletePayment: remove("payments"),
      upsertTask: upsert<Task>("tasks"),
      deleteTask: remove("tasks"),
      newId: uid,
      staffName: (id) => data.staff.find((s) => s.id === id)?.name || "—",
      customerName: (id) => data.customers.find((c) => c.id === id)?.legalName || "—",
      businessName: (id) => data.businesses.find((b) => b.id === id)?.legalName || "—",
      metrics: computeMetrics(data),
    }),
    [data, auth]
  );

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-white text-[#002D62]">Loading admin…</div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  const d = parseISO(dateStr);
  if (!isValid(d)) return null;
  return differenceInCalendarDays(d, new Date());
}

export function addDaysIso(dateStr: string, days: number) {
  return addDays(parseISO(dateStr), days).toISOString().slice(0, 10);
}

export function emptyCustomer(staffId: string, id: string): Customer {
  return {
    id,
    legalName: "",
    preferredName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    residentialAddress: "",
    idType: "Florida Driver License",
    idExpiration: "",
    ssnLast4: "",
    citizenshipStatus: "US Citizen",
    preferredLanguage: "English",
    bestContactMethod: "Phone",
    emergencyContact: "",
    pipelineStage: "New Client",
    assignedStaffId: staffId,
    createdAt: new Date().toISOString().slice(0, 10),
    notes: "",
  };
}

export function emptyLicense(customerId: string, businessId: string, staffId: string, id: string): LicenseRecord {
  return {
    id,
    type: "",
    category: "Health Care",
    agency: "",
    jurisdiction: "State",
    holderCustomerId: customerId,
    businessId,
    licenseNumber: "",
    applicationNumber: "",
    status: "In Process",
    issueDate: "",
    effectiveDate: "",
    expirationDate: "",
    renewalDeadline: "",
    renewalFrequency: "Annual",
    fee: 0,
    amountPaid: 0,
    paymentDate: "",
    paymentMethod: "",
    confirmationNumber: "",
    assignedStaffId: staffId,
    agencyPortalUrl: "",
    notes: "",
    verificationDate: "",
    nextActionDate: "",
  };
}

export function emptyPayment(customerId: string, businessId: string, id: string): Payment {
  return {
    id,
    customerId,
    businessId,
    description: "",
    serviceFee: 0,
    governmentFee: 0,
    inspectionFee: 0,
    amountPaid: 0,
    balance: 0,
    paymentDate: "",
    method: "",
    receipt: "",
    status: "Due",
  };
}

export function emptyBusiness(customerId: string, id: string): Business {
  return {
    id,
    customerId,
    legalName: "",
    dba: "",
    entityType: "LLC",
    floridaDocNumber: "",
    ein: "",
    dateEstablished: "",
    description: "",
    industry: "Health Care",
    phone: "",
    email: "",
    website: "",
    mailingAddress: "",
    county: "",
    municipality: "",
    employees: 0,
    expectedOpening: "",
    operatingHours: "",
  };
}

export function calcPaymentBalance(p: Pick<Payment, "serviceFee" | "governmentFee" | "inspectionFee" | "amountPaid">) {
  return Math.max(0, p.serviceFee + p.governmentFee + p.inspectionFee - p.amountPaid);
}
