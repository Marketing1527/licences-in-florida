"use client";

import { PageHeader, Card, Button } from "@/components/ui";
import { asset } from "@/lib/paths";
import { useStore } from "@/lib/store";
import { SEED_DATA } from "@/lib/seed";

export default function SettingsPage() {
  const { setData } = useStore();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Org defaults and data tools." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h2 className="font-bold">Branding</h2>
          <p className="text-sm text-[#5A6A7A]">Navy #002D62 · Orange #FF8C00</p>
          <img src={asset("/logo.png")} alt="Logo" className="h-12 object-contain" />
        </Card>
        <Card className="space-y-3 p-5">
          <h2 className="font-bold">Document storage</h2>
          <p className="text-sm text-[#5A6A7A]">
            Uploads use Vercel Blob when configured. Files stay linked to each customer.
          </p>
        </Card>
        <Card className="space-y-3 p-5">
          <h2 className="font-bold">Coming soon</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[#5A6A7A]">
            <li>QuickBooks invoicing sync</li>
            <li>Client document portal</li>
            <li>Automated renewal reminders</li>
          </ul>
        </Card>
        <Card className="space-y-3 p-5">
          <h2 className="font-bold">Demo data</h2>
          <p className="text-sm text-[#5A6A7A]">
            Reset local demo records. Your edits are stored in this browser.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              if (confirm("Reset all admin data to the demo seed?")) setData(SEED_DATA);
            }}
          >
            Reset demo data
          </Button>
        </Card>
      </div>
    </div>
  );
}
