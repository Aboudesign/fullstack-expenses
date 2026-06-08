"use client";

import { FormEvent, useState } from "react";
import { CATEGORY_MAP } from "../constants";
import { useLocale } from "../context/LocaleContext";
import type { Category, TransactionInput } from "../types";
import CategorySelect from "./CategorySelect";

type AddTransactionFormProps = {
  onSubmit: (input: TransactionInput) => Promise<void>;
  loading: boolean;
};

export default function AddTransactionForm({
  onSubmit,
  loading,
}: AddTransactionFormProps) {
  const { currencyCode } = useLocale();
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionInput["type"]>("expense");
  const [category, setCategory] = useState<Category>("food");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(",", "."));
    if (!text.trim() || Number.isNaN(parsed) || parsed <= 0) return;

    await onSubmit({
      text: text.trim(),
      amount: parsed,
      type,
      category,
    });
    setText("");
    setAmount("");
    setCategory("food");
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Nouvelle opération</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="form-control w-full">
            <span className="label-text mb-1">Description</span>
            <input
              type="text"
              placeholder="Ex. Courses Carrefour, Salaire juin…"
              className="input input-bordered w-full"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text mb-1">Montant ({currencyCode})</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Type</span>
              <select
                className="select select-bordered w-full"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as TransactionInput["type"])
                }
              >
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
              </select>
            </label>
          </div>

          <label className="form-control w-full">
            <span className="label-text mb-1">Catégorie</span>
            <CategorySelect value={category} onChange={setCategory} />
          </label>

          {category && (
            <p className="text-sm text-base-content/50 -mt-2">
              <span
                className={`badge badge-sm ${CATEGORY_MAP[category].badgeClass}`}
              >
                {CATEGORY_MAP[category].label}
              </span>
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Ajouter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
