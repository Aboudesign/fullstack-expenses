"use client";

import { CATEGORY_MAP } from "../constants";
import { useLocale } from "../context/LocaleContext";
import type { Transaction } from "../types";

type TransactionListProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  emptyMessage?: string;
};

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  deletingId,
  emptyMessage = "Aucune opération pour cette période.",
}: TransactionListProps) {
  const { formatCurrency, formatDate } = useLocale();

  if (transactions.length === 0) {
    return (
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body items-center text-center py-12">
          <p className="text-lg font-medium">Historique vide</p>
          <p className="text-base-content/60">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Historique</h2>
        <ul className="divide-y divide-base-content/10">
          {transactions.map((t) => {
            const amount = Number(t.amount);
            const isIncome = amount > 0;
            const cat = t.category ?? "other";
            const catMeta = CATEGORY_MAP[cat];

            return (
              <li
                key={t.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium truncate">{t.text}</p>
                    <span
                      className={`badge badge-sm ${catMeta?.badgeClass ?? "badge-ghost"}`}
                    >
                      {catMeta?.label ?? cat}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/60 mt-0.5">
                    {formatDate(t.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <span
                    className={`badge badge-lg ${
                      isIncome ? "badge-success" : "badge-error"
                    } badge-outline font-mono`}
                  >
                    {isIncome ? "+" : "−"}
                    {formatCurrency(Math.abs(amount))}
                  </span>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square"
                    aria-label={`Modifier ${t.text}`}
                    onClick={() => onEdit(t)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square text-error"
                    aria-label={`Supprimer ${t.text}`}
                    disabled={deletingId === t.id}
                    onClick={() => onDelete(t.id)}
                  >
                    {deletingId === t.id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
