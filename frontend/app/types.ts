export type Category =
  | "food"
  | "housing"
  | "transport"
  | "health"
  | "leisure"
  | "salary"
  | "shopping"
  | "other";

export type Transaction = {
  id: string;
  text: string;
  amount: number;
  category: Category;
  created_at: string;
};

export type TransactionType = "income" | "expense";

export type TransactionInput = {
  text: string;
  amount: number;
  type: TransactionType;
  category: Category;
};

export type CategoryBudget = {
  id: string;
  category: Category;
  month: string;
  limit: number;
};

export type ThemeMode = "light" | "night";

export type LocaleSettings = {
  locale: string;
  currency: string;
};
