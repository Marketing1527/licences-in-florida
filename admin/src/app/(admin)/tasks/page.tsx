"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  PageHeader,
  Card,
  DataTable,
  Badge,
  Button,
  Modal,
  Field,
  inputClass,
} from "@/components/ui";
import type { Task } from "@/lib/types";
import { useStore } from "@/lib/store";

function emptyTask(staffId: string, id: string): Task {
  return {
    id,
    title: "",
    type: "General",
    assignedStaffId: staffId,
    priority: "Medium",
    dueDate: new Date().toISOString().slice(0, 10),
    status: "Open",
    clientVisible: false,
    notes: "",
  };
}

export default function TasksPage() {
  const { data, staffName, customerName, upsertTask, deleteTask, newId } = useStore();
  const [draft, setDraft] = useState<Task | null>(null);

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Documents, filings, inspections, and renewals."
        actions={
          <Button onClick={() => setDraft(emptyTask(data.staff[0]?.id || "s1", newId("task")))}>
            <Plus className="h-4 w-4" /> Add task
          </Button>
        }
      />
      <Card>
        <DataTable
          headers={["Task", "Customer", "Assignee", "Due", "Priority", "Status", ""]}
          rows={data.tasks.map((t) => [
            <div key={t.id}>
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-[#5A6A7A]">{t.type}</p>
            </div>,
            t.customerId ? customerName(t.customerId) : "—",
            staffName(t.assignedStaffId),
            t.dueDate,
            <Badge key={t.priority} tone={t.priority === "Urgent" || t.priority === "High" ? "red" : "gray"}>
              {t.priority}
            </Badge>,
            <Badge key={t.status} tone={t.status === "Done" ? "green" : "navy"}>
              {t.status}
            </Badge>,
            <div key={`${t.id}-a`} className="flex gap-1">
              <Button variant="ghost" className="!px-2 !py-1" onClick={() => setDraft({ ...t })}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                className="!px-2 !py-1 text-red-600"
                onClick={() => {
                  if (confirm("Delete this task?")) deleteTask(t.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>,
          ])}
        />
      </Card>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="Task">
        {draft && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              upsertTask(draft);
              setDraft(null);
            }}
          >
            <Field label="Title *">
              <input
                required
                className={inputClass}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Type">
                <input
                  className={inputClass}
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                />
              </Field>
              <Field label="Customer">
                <select
                  className={inputClass}
                  value={draft.customerId || ""}
                  onChange={(e) => setDraft({ ...draft, customerId: e.target.value || undefined })}
                >
                  <option value="">None</option>
                  {data.customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.legalName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Assignee">
                <select
                  className={inputClass}
                  value={draft.assignedStaffId}
                  onChange={(e) => setDraft({ ...draft, assignedStaffId: e.target.value })}
                >
                  {data.staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Due date">
                <input
                  type="date"
                  className={inputClass}
                  value={draft.dueDate}
                  onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
                />
              </Field>
              <Field label="Priority">
                <select
                  className={inputClass}
                  value={draft.priority}
                  onChange={(e) => setDraft({ ...draft, priority: e.target.value as Task["priority"] })}
                >
                  {["Low", "Medium", "High", "Urgent"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className={inputClass}
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as Task["status"] })}
                >
                  {["Open", "In Progress", "Done", "Blocked"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Notes">
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button type="submit">Save task</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
