import type { Category } from "./types";

export const CATEGORIES: {
  value: Category;
  label: string;
  badgeClass: string;
}[] = [
  { value: "food", label: "Alimentation", badgeClass: "badge-warning" },
  { value: "housing", label: "Logement", badgeClass: "badge-info" },
  { value: "transport", label: "Transport", badgeClass: "badge-primary" },
  { value: "health", label: "Santé", badgeClass: "badge-accent" },
  { value: "leisure", label: "Loisirs", badgeClass: "badge-secondary" },
  { value: "salary", label: "Salaire", badgeClass: "badge-success" },
  { value: "shopping", label: "Shopping", badgeClass: "badge-neutral" },
  { value: "other", label: "Autre", badgeClass: "badge-ghost" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c])
) as Record<Category, (typeof CATEGORIES)[number]>;

export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c.value !== "salary");

export const THEME_STORAGE_KEY = "expenses-theme";

export const CHART_COLORS = [
  "#36d399",
  "#3abff8",
  "#f87272",
  "#fbbd23",
  "#a78bfa",
  "#fb923c",
  "#e879f9",
  "#94a3b8",
];
