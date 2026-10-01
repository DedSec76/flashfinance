export type TransactionType = "income" | "expense";

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    description: string | null;
    date: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateTransactionData = Omit<
    Transaction,
    "id" | "createdAt" | "updatedAt"
>;

export type updateTransactionData = Partial<
    Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">
>;

export type CreateTransactionInput = Omit<
  CreateTransactionData,
  "userId"
>;