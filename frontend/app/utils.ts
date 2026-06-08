import type { Category, CategoryBudget, LocaleSettings, Transaction } from "./types";
import { CATEGORY_MAP } from "./constants";

export type LocaleFormatters = {
  formatCurrency: (value: number) => string;
  formatDate: (iso: string) => string;
  formatMonthLabel: (monthKey: string) => string;
  formatAmountPlain: (value: number) => string;
  currencyCode: string;
  currencySymbol: string;
};

export function createFormatters(settings: LocaleSettings): LocaleFormatters {
  const { locale, currency } = settings;

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  const numberFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const currencySymbol =
    currencyFormatter
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? currency;

  return {
    currencyCode: currency,
    currencySymbol,
    formatCurrency: (value: number) => currencyFormatter.format(value),
    formatDate: (iso: string) =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso)),
    formatMonthLabel: (monthKey: string) => {
      const [y, m] = monthKey.split("-").map(Number);
      return new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(new Date(y, m - 1, 1));
    },
    formatAmountPlain: (value: number) => numberFormatter.format(value),
  };
}

export function getMonthKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function getCurrentMonthKey(): string {
  return getMonthKey(new Date().toISOString());
}

export function getAvailableMonths(transactions: Transaction[]): string[] {
  const keys = new Set(transactions.map((t) => getMonthKey(t.created_at)));
  keys.add(getCurrentMonthKey());
  return Array.from(keys).sort((a, b) => b.localeCompare(a));
}

export function filterByMonth(
  transactions: Transaction[],
  monthKey: string | "all"
): Transaction[] {
  if (monthKey === "all") return transactions;
  return transactions.filter((t) => getMonthKey(t.created_at) === monthKey);
}

export function computeStats(transactions: Transaction[]) {
  const balance = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const income = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  return { balance, income, expenses };
}

export function getCategoryLabel(category: Category): string {
  return CATEGORY_MAP[category]?.label ?? category;
}

export function getExpensesByCategory(transactions: Transaction[]) {
  const totals = new Map<Category, number>();

  for (const t of transactions) {
    const amount = Number(t.amount);
    if (amount >= 0) continue;
    const cat = t.category ?? "other";
    totals.set(cat, (totals.get(cat) ?? 0) + Math.abs(amount));
  }

  return Array.from(totals.entries())
    .map(([category, value]) => ({
      category,
      name: getCategoryLabel(category),
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

export function getIncomeExpenseChartData(transactions: Transaction[]) {
  const { income, expenses } = computeStats(transactions);
  return [
    { name: "Revenus", value: income, fill: "#36d399" },
    { name: "Dépenses", value: expenses, fill: "#f87272" },
  ];
}

export function getSpentByCategory(
  transactions: Transaction[]
): Record<Category, number> {
  const spent: Partial<Record<Category, number>> = {};

  for (const t of transactions) {
    const amount = Number(t.amount);
    if (amount >= 0) continue;
    const cat = t.category ?? "other";
    spent[cat] = (spent[cat] ?? 0) + Math.abs(amount);
  }

  return spent as Record<Category, number>;
}

export function buildBudgetRows(
  transactions: Transaction[],
  budgets: CategoryBudget[]
) {
  const spent = getSpentByCategory(transactions);
  const limitByCategory = Object.fromEntries(
    budgets.map((b) => [b.category, Number(b.limit)])
  ) as Partial<Record<Category, number>>;

  const categories = new Set<Category>([
    ...Object.keys(spent),
    ...budgets.map((b) => b.category),
  ] as Category[]);

  return Array.from(categories)
    .map((category) => {
      const used = spent[category] ?? 0;
      const limit = limitByCategory[category] ?? 0;
      const percent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
      const overBudget = limit > 0 && used > limit;

      return {
        category,
        label: getCategoryLabel(category),
        used,
        limit,
        percent,
        overBudget,
      };
    })
    .filter((row) => row.used > 0 || row.limit > 0)
    .sort((a, b) => b.used - a.used);
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportTransactionsToCsv(
  transactions: Transaction[],
  filename: string,
  formatters: Pick<
    LocaleFormatters,
    "formatDate" | "formatAmountPlain" | "currencyCode"
  >
) {
  const header = [
    "Date",
    "Description",
    "Catégorie",
    "Type",
    `Montant (${formatters.currencyCode})`,
  ];
  const rows = transactions.map((t) => {
    const amount = Number(t.amount);
    const isIncome = amount > 0;
    const signed = isIncome ? amount : -Math.abs(amount);
    return [
      formatters.formatDate(t.created_at),
      t.text,
      getCategoryLabel(t.category ?? "other"),
      isIncome ? "Revenu" : "Dépense",
      formatters.formatAmountPlain(signed),
    ].map(escapeCsvCell);
  });

  const csv = [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
