export type SummaryDateRange = {
  start: Date;
  end: Date;
};

export type SummaryCategory = {
  id: string;
  name: string;
  type: "income" | "expense";
  total: number;
};

export type FinancialSummary = {
  scope: "overall" | "month";
  month: string | null;
  income: number;
  expenses: number;
  balance: number;
  categories: SummaryCategory[];
};