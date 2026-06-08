"use client";

import { FormEvent, useState } from "react";
import { CATEGORY_MAP, EXPENSE_CATEGORIES } from "../constants";
import { useLocale } from "../context/LocaleContext";
import type { Category, CategoryBudget, Transaction } from "../types";
import { buildBudgetRows } from "../utils";

type BudgetOverviewProps = {
  month: string;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  saving: boolean;
  onSave: (
    toSave: { category: Category; limit: number }[],
    toDelete: string[]
  ) => Promise<void>;
};

export default function BudgetOverview({
  month,
  transactions,
  budgets,
  saving,
  onSave,
}: BudgetOverviewProps) {
  const { formatCurrency, formatMonthLabel, currencyCode } = useLocale();
  const [showForm, setShowForm] = useState(false);
  const [limits, setLimits] = useState<Record<string, string>>({});

  const rows = buildBudgetRows(transactions, budgets);
  const budgetMap = Object.fromEntries(budgets.map((b) => [b.category, b]));

  const openForm = () => {
    const initial: Record<string, string> = {};
    for (const c of EXPENSE_CATEGORIES) {
      const existing = budgetMap[c.value];
      initial[c.value] = existing ? String(Number(existing.limit)) : "";
    }
    setLimits(initial);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const toSave = EXPENSE_CATEGORIES.filter((c) => {
      const raw = limits[c.value]?.trim();
      if (!raw) return false;
      const parsed = parseFloat(raw.replace(",", "."));
      return !Number.isNaN(parsed) && parsed > 0;
    });

    const savePayload = toSave.map((c) => ({
      category: c.value,
      limit: parseFloat(limits[c.value].replace(",", ".")),
    }));

    const deleteIds = budgets
      .filter((b) => {
        const raw = limits[b.category]?.trim();
        return !raw || parseFloat(raw.replace(",", ".")) <= 0;
      })
      .map((b) => b.id);

    await onSave(savePayload, deleteIds);
    setShowForm(false);
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="card-title">Budgets par catégorie</h2>
            <p className="text-sm text-base-content/60">
              {formatMonthLabel(month)}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={openForm}
          >
            {budgets.length > 0 ? "Modifier les budgets" : "Définir les budgets"}
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="text-base-content/60 text-center py-6">
            Aucun budget défini pour ce mois. Ajoutez des plafonds pour suivre
            vos dépenses.
          </p>
        ) : (
          <ul className="flex flex-col gap-4 mt-2">
            {rows.map((row) => {
              const badge = CATEGORY_MAP[row.category]?.badgeClass ?? "badge-ghost";
              const progressClass = row.overBudget
                ? "progress-error"
                : row.percent >= 80
                  ? "progress-warning"
                  : "progress-success";

              return (
                <li key={row.category}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className={`badge ${badge}`}>{row.label}</span>
                    <span className="text-sm font-mono">
                      {formatCurrency(row.used)}
                      {row.limit > 0 && (
                        <span className="text-base-content/50">
                          {" "}
                          / {formatCurrency(row.limit)}
                        </span>
                      )}
                    </span>
                  </div>
                  {row.limit > 0 ? (
                    <>
                      <progress
                        className={`progress w-full ${progressClass}`}
                        value={row.percent}
                        max={100}
                      />
                      {row.overBudget && (
                        <p className="text-xs text-error mt-1">
                          Dépassement de{" "}
                          {formatCurrency(row.used - row.limit)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-base-content/50">
                      Dépensé sans plafond défini
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-4 p-4 rounded-box bg-base-300 flex flex-col gap-3"
          >
            <p className="text-sm font-medium">
              Plafonds mensuels ({currencyCode}) — laissez vide pour supprimer
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPENSE_CATEGORIES.map((c) => (
                <label key={c.value} className="form-control">
                  <span className="label-text text-xs mb-1">{c.label}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex. 300"
                    className="input input-bordered input-sm"
                    value={limits[c.value] ?? ""}
                    onChange={(e) =>
                      setLimits((prev) => ({
                        ...prev,
                        [c.value]: e.target.value,
                      }))
                    }
                  />
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
