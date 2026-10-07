export type CategoryType = "income" | "expense";

export interface Category {
    id: string;
    name: string;
    normalizedName: string;
    type: CategoryType;
    userId: string;
}