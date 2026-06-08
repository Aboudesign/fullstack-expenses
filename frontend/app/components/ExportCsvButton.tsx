"use client";

import { useLocale } from "../context/LocaleContext";
import type { Transaction } from "../types";
import { exportTransactionsToCsv } from "../utils";

type ExportCsvButtonProps = {
  transactions: Transaction[];
  monthFilter: string | "all";
};

export default function ExportCsvButton({
  transactions,
  monthFilter,
}: ExportCsvButtonProps) {
  const { formatDate, formatAmountPlain, formatMonthLabel, currencyCode } =
    useLocale();

  const handleExport = () => {
    if (transactions.length === 0) return;

    const suffix =
      monthFilter === "all"
        ? "toutes-periodes"
        : monthFilter.replace("-", "_");
    const filename = `depenses_${suffix}.csv`;
    exportTransactionsToCsv(transactions, filename, {
      formatDate,
      formatAmountPlain,
      currencyCode,
    });
  };

  const label =
    monthFilter === "all"
      ? "Exporter tout (CSV)"
      : `Exporter ${formatMonthLabel(monthFilter)} (CSV)`;

  return (
    <button
      type="button"
      className="btn btn-outline btn-sm sm:btn-md gap-2"
      onClick={handleExport}
      disabled={transactions.length === 0}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {label}
    </button>
  );
}
