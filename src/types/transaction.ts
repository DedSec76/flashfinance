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