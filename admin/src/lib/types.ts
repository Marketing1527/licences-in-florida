/** Shared types for Licenses in Florida Admin */

/** Core license statuses (Activa / En Proceso / Vencida / Pendiente de Pago) */
export type LicenseStatus = "Active" | "In Process" | "Expired" | "Pending Payment";

/** Application workflow detail (separate from license lifecycle status) */
export type ApplicationStatus = string;

export type PipelineStage =
  | "New Client"
  | "Documents Needed"
  | "Preparing Application"
  | "Ready to File"
  | "Submitted"
  | "Correction Requested"
  | "Inspection Pending"
  | "Approved"
  | "Renewal Monitoring";

export type ContactRole =
  | "Owner"
  | "Authorized representative"
  | "Qualifying agent"
  | "Medical director"
  | "Clinic director"
  | "Administrator"
  | "Manager"
  | "Registered agent"
  | "Accountant"
  | "Attorney"
  | "Landlord"
  | "Contractor"
  | "Insurance agent";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Specialist" | "Viewer";
  active: boolean;
}

export interface Customer {
  id: string;
  legalName: string;
  preferredName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  residentialAddress: string;
  idType: string;
  idExpiration: string;
  ssnLast4: string;
  citizenshipStatus: string;
  preferredLanguage: string;
  bestContactMethod: string;
  emergencyContact: string;
  pipelineStage: PipelineStage;
  assignedStaffId: string;
  createdAt: string;
  notes: string;
}

export interface Business {
  id: string;
  customerId: string;
  legalName: string;
  dba: string;
  entityType: "LLC" | "Corporation" | "Sole Proprietor" | "Partnership";
  floridaDocNumber: string;
  ein: string;
  dateEstablished: string;
  description: string;
  industry: string;
  phone: string;
  email: string;
  website: string;
  mailingAddress: string;
  county: string;
  municipality: string;
  employees: number;
  expectedOpening: string;
  operatingHours: string;
}

export interface Location {
  id: string;
  businessId: string;
  customerId: string;
  name: string;
  address: string;
  county: string;
  city: string;
  folio: string;
  zoning: string;
  zoningStatus: string;
  certificateOfUse: string;
  localBusinessTax: string;
  fireInspection: string;
  buildingInspection: string;
  healthInspection: string;
  leaseStart: string;
  leaseEnd: string;
  landlord: string;
  squareFootage: number;
  openingStatus: string;
}

export interface BusinessContact {
  id: string;
  businessId: string;
  locationId?: string;
  name: string;
  role: ContactRole;
  phone: string;
  email: string;
  licenseNumber?: string;
}

export interface LicenseRecord {
  id: string;
  type: string;
  category: string;
  agency: string;
  jurisdiction: "Federal" | "State" | "County" | "City";
  holderCustomerId: string;
  businessId: string;
  locationId?: string;
  licenseNumber: string;
  applicationNumber: string;
  status: LicenseStatus;
  issueDate: string;
  effectiveDate: string;
  expirationDate: string;
  renewalDeadline: string;
  renewalFrequency: string;
  fee: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  confirmationNumber: string;
  assignedStaffId: string;
  agencyPortalUrl: string;
  notes: string;
  verificationDate: string;
  nextActionDate: string;
}

export interface Application {
  id: string;
  licenseId: string;
  customerId: string;
  businessId: string;
  locationId?: string;
  title: string;
  status: ApplicationStatus;
  formName: string;
  formVersion: string;
  signatureRequired: boolean;
  signatureReceived: boolean;
  filingMethod: string;
  submissionDate: string;
  paymentCompleted: boolean;
  correctionDeadline: string;
  assignedStaffId: string;
  checklist: { item: string; done: boolean }[];
}

export interface Deficiency {
  id: string;
  applicationId: string;
  dateReceived: string;
  agency: string;
  itemsRequested: string;
  responseDeadline: string;
  responsibleStaffId: string;
  dateResubmitted: string;
  outcome: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  customerId?: string;
  businessId?: string;
  locationId?: string;
  licenseId?: string;
  contactId?: string;
  uploadedAt: string;
  effectiveDate: string;
  expirationDate: string;
  verifiedBy: string;
  verificationStatus: "Pending" | "Verified" | "Rejected" | "Expired";
  confidentiality: "Public" | "Internal" | "Restricted" | "Sensitive";
  version: number;
  blobUrl?: string;
  notes: string;
}

export interface Inspection {
  id: string;
  type: string;
  agency: string;
  businessId: string;
  locationId: string;
  customerId: string;
  permitNumber: string;
  folio: string;
  invoiceNumber: string;
  requestedDate: string;
  scheduledDate: string;
  inspector: string;
  onsiteContact: string;
  fee: number;
  paymentStatus: string;
  result: string;
  violations: string;
  reinspectionRequired: boolean;
  status: string;
}

export interface ProviderCredential {
  id: string;
  customerId: string;
  businessId: string;
  legalName: string;
  npi: string;
  taxonomy: string;
  flLicense: string;
  licenseExpiration: string;
  caqhId: string;
  caqhReattestDate: string;
  medicarePtan: string;
  pecosStatus: string;
  medicaidId: string;
  malpracticePolicy: string;
  credentialingStatus: string;
  payer: string;
}

export interface Task {
  id: string;
  title: string;
  type: string;
  customerId?: string;
  businessId?: string;
  licenseId?: string;
  applicationId?: string;
  assignedStaffId: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string;
  status: "Open" | "In Progress" | "Done" | "Blocked";
  clientVisible: boolean;
  notes: string;
}

export interface Reminder {
  id: string;
  title: string;
  relatedType: string;
  relatedId: string;
  dueDate: string;
  channel: "In-app" | "Email" | "SMS" | "Calendar";
  recipient: string;
  status: "Scheduled" | "Sent" | "Acknowledged" | "Overdue";
}

export interface Payment {
  id: string;
  customerId: string;
  businessId: string;
  description: string;
  serviceFee: number;
  governmentFee: number;
  inspectionFee: number;
  amountPaid: number;
  balance: number;
  paymentDate: string;
  method: string;
  receipt: string;
  status: "Due" | "Partial" | "Paid" | "Refunded";
}

export interface LicenseTemplate {
  id: string;
  name: string;
  category: string;
  agency: string;
  jurisdiction: string;
  checklist: string[];
}

export interface Agency {
  id: string;
  name: string;
  type: string;
  portalUrl: string;
  notes: string;
}

export interface AdminData {
  staff: StaffUser[];
  customers: Customer[];
  businesses: Business[];
  locations: Location[];
  contacts: BusinessContact[];
  licenses: LicenseRecord[];
  applications: Application[];
  deficiencies: Deficiency[];
  documents: DocumentRecord[];
  inspections: Inspection[];
  providers: ProviderCredential[];
  tasks: Task[];
  reminders: Reminder[];
  payments: Payment[];
  templates: LicenseTemplate[];
  agencies: Agency[];
}

export const PIPELINE_STAGES: PipelineStage[] = [
  "New Client",
  "Documents Needed",
  "Preparing Application",
  "Ready to File",
  "Submitted",
  "Correction Requested",
  "Inspection Pending",
  "Approved",
  "Renewal Monitoring",
];

export const LICENSE_STATUSES: LicenseStatus[] = [
  "Active",
  "In Process",
  "Expired",
  "Pending Payment",
];

export const LICENSE_STATUS_LABELS: Record<LicenseStatus, string> = {
  Active: "Active (Activa)",
  "In Process": "In Process (En Proceso)",
  Expired: "Expired (Vencida)",
  "Pending Payment": "Pending Payment (Pendiente de Pago)",
};

export const DOCUMENT_TYPES = [
  "License PDF",
  "Government ID",
  "Lease",
  "EIN letter",
  "Articles of organization or incorporation",
  "Certificate of use",
  "Insurance certificate",
  "Bank statement",
  "Deficiency letter",
  "Floor plan",
  "Application",
  "Other",
] as const;

/** Map legacy detailed statuses → simplified license statuses */
export function normalizeLicenseStatus(raw: string): LicenseStatus {
  if (LICENSE_STATUSES.includes(raw as LicenseStatus)) return raw as LicenseStatus;
  const s = raw.toLowerCase();
  if (s.includes("payment") || s.includes("pendiente")) return "Pending Payment";
  if (s.includes("expir") || s.includes("vencid") || s === "suspended" || s === "closed") return "Expired";
  if (
    s.includes("active") ||
    s.includes("issued") ||
    s.includes("approved") ||
    s.includes("activa") ||
    s === "exempt" ||
    s === "not required"
  ) {
    return "Active";
  }
  return "In Process";
}

export const PAYMENT_STATUSES: Payment["status"][] = ["Due", "Partial", "Paid", "Refunded"];

export const JURISDICTIONS: LicenseRecord["jurisdiction"][] = ["Federal", "State", "County", "City"];

export const ENTITY_TYPES: Business["entityType"][] = [
  "LLC",
  "Corporation",
  "Sole Proprietor",
  "Partnership",
];

/** Simplified nav — customer-centric ops console */
export const NAV_GROUPS: {
  label: string;
  items: { href: string; label: string; icon: string }[];
}[] = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" }],
  },
  {
    label: "Clients",
    items: [
      { href: "/customers", label: "Customers", icon: "Users" },
      { href: "/licenses", label: "Licenses", icon: "BadgeCheck" },
      { href: "/applications", label: "Applications", icon: "FileStack" },
      { href: "/inspections", label: "Inspections", icon: "ClipboardCheck" },
    ],
  },
  {
    label: "Work",
    items: [
      { href: "/tasks", label: "Tasks", icon: "CheckSquare" },
      { href: "/documents", label: "Documents", icon: "FolderOpen" },
      { href: "/payments", label: "Payments", icon: "CreditCard" },
    ],
  },
  {
    label: "System",
    items: [{ href: "/settings", label: "Settings", icon: "Settings" }],
  },
];
