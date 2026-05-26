"use client";

import Link from "next/link";
import { Card, CardContent, Badge, SectionHeading } from "@/components/ui";
import { FileText, ExternalLink } from "lucide-react";

const MOCK_INVOICES = [
  { id: "INV-001", date: "Mar 15, 2025", amount: 19.0, status: "paid" },
  { id: "INV-002", date: "Feb 15, 2025", amount: 19.0, status: "paid" },
  { id: "INV-003", date: "Jan 15, 2025", amount: 19.0, status: "paid" },
  { id: "INV-004", date: "Dec 15, 2024", amount: 0, status: "free" },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Invoices"
        description="View and download your invoices"
      />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {MOCK_INVOICES.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{inv.id}</p>
                    <p className="text-xs text-neutral-400">{inv.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {inv.amount > 0 ? `$${inv.amount.toFixed(2)}` : "Free"}
                  </span>
                  <Badge
                    variant={
                      inv.status === "paid" ? "success" : "default"
                    }
                  >
                    {inv.status}
                  </Badge>
                  {inv.amount > 0 && (
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
