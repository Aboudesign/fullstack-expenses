"use client";

import { ReactNode } from "react";
import { useLocale } from "../context/LocaleContext";

type MonthFilterProps = {
  months: string[];
  value: string | "all";
  onChange: (value: string | "all") => void;
  actions?: ReactNode;
};

export default function MonthFilter({
  months,
  value,
  onChange,
  actions,
}: MonthFilterProps) {
  const { formatMonthLabel } = useLocale();

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body py-4 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="label-text font-medium shrink-0">Période</span>
          <select
            className="select select-bordered select-sm sm:select-md flex-1"
            value={value}
            onChange={(e) => onChange(e.target.value as string | "all")}
          >
            <option value="all">Toutes les périodes</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2 justify-end">{actions}</div>
        )}
      </div>
    </div>
  );
}
