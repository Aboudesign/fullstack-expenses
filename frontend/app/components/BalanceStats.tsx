"use client";

import { useLocale } from "../context/LocaleContext";

type BalanceStatsProps = {
  balance: number;
  income: number;
  expenses: number;
};

export default function BalanceStats({
  balance,
  income,
  expenses,
}: BalanceStatsProps) {
  const { formatCurrency } = useLocale();

  return (
    <div className="stats stats-vertical w-full shadow-lg lg:stats-horizontal bg-base-200">
      <div className="stat">
        <div className="stat-title">Solde</div>
        <div
          className={`stat-value ${balance >= 0 ? "text-success" : "text-error"}`}
        >
          {formatCurrency(balance)}
        </div>
        <div className="stat-desc">Revenus − dépenses</div>
      </div>
      <div className="stat">
        <div className="stat-title">Revenus</div>
        <div className="stat-value text-success">{formatCurrency(income)}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Dépenses</div>
        <div className="stat-value text-error">{formatCurrency(expenses)}</div>
      </div>
    </div>
  );
}
