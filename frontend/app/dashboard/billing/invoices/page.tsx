"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { FileText, ExternalLink, ArrowLeft, Download } from "lucide-react";

const MOCK_INVOICES = [
  { id: "INV-001", date: "Mar 15, 2025", amount: 19.0, status: "paid" },
  { id: "INV-002", date: "Feb 15, 2025", amount: 19.0, status: "paid" },
  { id: "INV-003", date: "Jan 15, 2025", amount: 19.0, status: "paid" },
  { id: "INV-004", date: "Dec 15, 2024", amount: 0, status: "free" },
];

export default function InvoicesPage() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-300 mb-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to billing
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Invoices</h1>
        <p className="mt-1 text-sm text-neutral-400">View and download your invoices</p>
      </div>

      {/* Invoices list */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <div className="divide-y divide-neutral-800">
          {MOCK_INVOICES.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-800/30">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">{inv.id}</p>
                  <p className="text-xs text-neutral-500">{inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-neutral-200">
                  {inv.amount > 0 ? `$${inv.amount.toFixed(2)}` : "Free"}
                </span>
                <Badge variant={inv.status === "paid" ? "success" : "default"}>
                  {inv.status}
                </Badge>
                {inv.amount > 0 && (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all"
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
