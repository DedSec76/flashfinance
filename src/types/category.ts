import mongoose from "mongoose";

export type CategoryType = "income" | "expense";

export interface Category {
    id: string;
    name: string;
    normalizedName: string;
    type: CategoryType;
    userId: string;
}

export type CategoryFilter = {
    _id?: string;
    id?: string;
    name: string;
    type: CategoryType;
}

export type PopulatedCategory = {
  _id: mongoose.Types.ObjectId;
  name: string;
};