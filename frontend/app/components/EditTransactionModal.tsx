"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "../context/LocaleContext";
import type { Category, Transaction, TransactionInput } from "../types";
import CategorySelect from "./CategorySelect";

type EditTransactionModalProps = {
  transaction: Transaction | null;
  loading: boolean;
  onClose: () => void;
  onSave: (id: string, input: TransactionInput) => Promise<void>;
};

function EditForm({
  transaction,
  loading,
  onClose,
  onSave,
}: {
  transaction: Transaction;
  loading: boolean;
  onClose: () => void;
  onSave: (id: string, input: TransactionInput) => Promise<void>;
}) {
  const { currencyCode } = useLocale();
  const n = Number(transaction.amount);
  const [text, setText] = useState(transaction.text);
  const [amount, setAmount] = useState(String(Math.abs(n)));
  const [type, setType] = useState<"income" | "expense">(
    n >= 0 ? "income" : "expense"
  );
  const [category, setCategory] = useState<Category>(
    transaction.category ?? "other"
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(",", "."));
    if (!text.trim() || Number.isNaN(parsed) || parsed <= 0) return;

    await onSave(transaction.id, {
      text: text.trim(),
      amount: parsed,
      type,
      category,
    });
  };

  return (
    <>
      <h3 className="font-bold text-lg">Modifier l&apos;opération</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <label className="form-control w-full">
          <span className="label-text mb-1">Description</span>
          <input
            type="text"
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
                setType(e.target.value as "income" | "expense")
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

        <div className="modal-action">
          <button
            type="button"
            className="btn"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </form>
    </>
  );
}

export default function EditTransactionModal({
  transaction,
  loading,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  return (
    <dialog className="modal" open={!!transaction}>
      <div className="modal-box">
        {transaction && (
          <EditForm
            key={transaction.id}
            transaction={transaction}
            loading={loading}
            onClose={onClose}
            onSave={onSave}
          />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          fermer
        </button>
      </form>
    </dialog>
  );
}
