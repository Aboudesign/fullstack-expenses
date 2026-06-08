"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "../constants";
import { useLocale } from "../context/LocaleContext";
import type { Transaction } from "../types";
import { getExpensesByCategory, getIncomeExpenseChartData } from "../utils";

type ExpenseChartsProps = {
  transactions: Transaction[];
};

function ChartTooltip({
  active,
  payload,
  formatCurrency,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
  formatCurrency: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-100 border border-base-content/10 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-medium">{payload[0].name}</p>
      <p>{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function ExpenseCharts({ transactions }: ExpenseChartsProps) {
  const { formatCurrency, currencySymbol } = useLocale();
  const byCategory = getExpensesByCategory(transactions);
  const incomeExpense = getIncomeExpenseChartData(transactions);
  const hasExpenses = byCategory.length > 0;
  const hasData = incomeExpense.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body items-center text-center py-8">
          <p className="text-base-content/60">
            Aucune donnée à afficher pour cette période.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-base">Revenus vs dépenses</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeExpense}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "oklch(0.8 0 0)", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(v) => `${v} ${currencySymbol}`}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                />
                <Tooltip
                  content={
                    <ChartTooltip formatCurrency={formatCurrency} />
                  }
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {incomeExpense.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-base">Dépenses par catégorie</h2>
          {hasExpenses ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {byCategory.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <ChartTooltip formatCurrency={formatCurrency} />
                    }
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    formatter={(value) => (
                      <span className="text-base-content/80">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-base-content/60 py-12">
              Pas de dépenses sur cette période.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
