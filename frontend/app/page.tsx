"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "./api";
import AddTransactionForm from "./components/AddTransactionForm";
import BalanceStats from "./components/BalanceStats";
import BudgetOverview from "./components/BudgetOverview";
import EditTransactionModal from "./components/EditTransactionModal";
import ExpenseCharts from "./components/ExpenseCharts";
import ExportCsvButton from "./components/ExportCsvButton";
import MonthFilter from "./components/MonthFilter";
import LocaleSelector from "./components/LocaleSelector";
import ThemeToggle from "./components/ThemeToggle";
import TransactionList from "./components/TransactionList";
import type { Category, CategoryBudget, Transaction, TransactionInput } from "./types";
import {
  computeStats,
  filterByMonth,
  getAvailableMonths,
  getCurrentMonthKey,
} from "./utils";

function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
      const first = Object.values(data)[0];
      if (Array.isArray(first)) return String(first[0]);
      if (typeof first === "string") return first;
    }
  }
  return "Une erreur est survenue. Vérifiez que le serveur API est démarré.";
}

function toPayload(input: TransactionInput) {
  return {
    text: input.text,
    amount: input.type === "expense" ? -input.amount : input.amount,
    category: input.category,
  };
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | "all">(
    getCurrentMonthKey()
  );
  const [editing, setEditing] = useState<Transaction | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get<Transaction[]>("transactions/");
        if (!cancelled) setTransactions(res.data);
      } catch (error) {
        if (!cancelled) toast.error(getErrorMessage(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (monthFilter === "all") return;

    let cancelled = false;

    (async () => {
      if (!cancelled) setLoadingBudgets(true);
      try {
        const res = await api.get<CategoryBudget[]>(
          `budgets/?month=${monthFilter}`
        );
        if (!cancelled) setBudgets(res.data);
      } catch (error) {
        if (!cancelled) toast.error(getErrorMessage(error));
      } finally {
        if (!cancelled) setLoadingBudgets(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [monthFilter]);

  const availableMonths = useMemo(
    () => getAvailableMonths(transactions),
    [transactions]
  );

  const filtered = useMemo(
    () => filterByMonth(transactions, monthFilter),
    [transactions, monthFilter]
  );

  const { balance, income, expenses } = computeStats(filtered);

  const handleAdd = async (input: TransactionInput) => {
    setSubmitting(true);
    try {
      const res = await api.post<Transaction>("transactions/", toPayload(input));
      setTransactions((prev) => [res.data, ...prev]);
      toast.success("Opération ajoutée");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id: string, input: TransactionInput) => {
    setSavingEdit(true);
    try {
      const res = await api.patch<Transaction>(
        `transactions/${id}/`,
        toPayload(input)
      );
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
      setEditing(null);
      toast.success("Opération mise à jour");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette opération ?")) return;

    setDeletingId(id);
    try {
      await api.delete(`transactions/${id}/`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Opération supprimée");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const saveBudget = async (category: Category, limit: number) => {
    if (monthFilter === "all") return;

    const res = await api.post<CategoryBudget>("budgets/", {
      category,
      month: monthFilter,
      limit,
    });
    setBudgets((prev) => {
      const others = prev.filter((b) => b.category !== category);
      return [...others, res.data];
    });
  };

  const deleteBudget = async (id: string) => {
    await api.delete(`budgets/${id}/`);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSaveBudgets = async (
    toSave: { category: Category; limit: number }[],
    toDelete: string[]
  ) => {
    setSavingBudget(true);
    try {
      for (const item of toSave) {
        await saveBudget(item.category, item.limit);
      }
      for (const id of toDelete) {
        await deleteBudget(id);
      }
      toast.success("Budgets enregistrés");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setSavingBudget(false);
    }
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="relative text-center pt-10 sm:pt-0">
        <div className="absolute right-0 top-0 flex items-center gap-1">
          <LocaleSelector />
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Mes dépenses</h1>
        <p className="text-base-content/60 mt-1">
          Suivez revenus et dépenses au quotidien
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-lg loading-spinner text-primary" />
        </div>
      ) : (
        <>
          <MonthFilter
            months={availableMonths}
            value={monthFilter}
            onChange={(value) => {
              setMonthFilter(value);
              if (value === "all") setBudgets([]);
            }}
            actions={
              <ExportCsvButton
                transactions={filtered}
                monthFilter={monthFilter}
              />
            }
          />
          <BalanceStats balance={balance} income={income} expenses={expenses} />
          {monthFilter !== "all" && (
            loadingBudgets ? (
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body items-center py-8">
                  <span className="loading loading-spinner text-primary" />
                </div>
              </div>
            ) : (
              <BudgetOverview
                month={monthFilter}
                transactions={filtered}
                budgets={budgets}
                saving={savingBudget}
                onSave={handleSaveBudgets}
              />
            )
          )}
          <ExpenseCharts transactions={filtered} />
          <AddTransactionForm onSubmit={handleAdd} loading={submitting} />
          <TransactionList
            transactions={filtered}
            onEdit={setEditing}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </>
      )}

      <EditTransactionModal
        transaction={editing}
        loading={savingEdit}
        onClose={() => setEditing(null)}
        onSave={handleEdit}
      />
    </main>
  );
}
