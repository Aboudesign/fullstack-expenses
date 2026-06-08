"use client";

import { useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { CURRENCIES, LOCALES } from "../locale-config";

export default function LocaleSelector() {
  const { settings, setLocale, setCurrency, formatCurrency } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost btn-sm gap-1"
        onClick={() => setOpen(true)}
        aria-label="Choisir langue et devise"
        title="Langue et devise"
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
            d="M3 5h12M9 3v2m4.24 12.76l1.42 1.42M18 12a6 6 0 11-12 0 6 6 0 0112 0zm-6 0v6m0-6H9m3 0h3"
          />
        </svg>
        <span className="hidden sm:inline text-xs font-mono">
          {settings.currency}
        </span>
      </button>

      <dialog className="modal" open={open}>
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg">Langue et devise</h3>
          <p className="text-sm text-base-content/60 mt-1">
            Format des dates et affichage des montants
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <label className="form-control w-full">
              <span className="label-text mb-1">Langue / région</span>
              <select
                className="select select-bordered w-full"
                value={settings.locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                {LOCALES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Devise</span>
              <select
                className="select select-bordered w-full"
                value={settings.currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label} ({c.symbol}) — {c.value}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-box bg-base-300 px-4 py-3 text-sm">
              <p className="text-base-content/60">Aperçu</p>
              <p className="font-mono mt-1">{formatCurrency(1234.56)}</p>
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => setOpen(false)}>
            fermer
          </button>
        </form>
      </dialog>
    </>
  );
}
