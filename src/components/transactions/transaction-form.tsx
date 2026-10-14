"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";

type TransactionType = "income" | "expense";

type ExistingTransaction = {

  _id: string;

  title: string;

  amount: number | string | { $numberDecimal: string };

  type: TransactionType;

  categoryId: string;

  description: string | null;

  date: string;

};

type Category = {

  _id?: string;

  id?: string;

  name: string;

  type: TransactionType;

};

type TransactionFormProps = {

  mode: "create" | "edit";

  transactionId?: string;

  returnTo?: string;

};

type ApiErrorResponse = {

  error?: {

    code?: string;

    message?: string;

    fields?: Record<string, string[] | undefined>;

  };

};

function getTodayLocalDate() {

  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

function getErrorMessage(data: ApiErrorResponse | null) {

  return data?.error?.message ??"Something went wrong. Please try again.";

}

function getFieldErrors(data: ApiErrorResponse | null) {

  const source = data?.error?.fields;

  const result: Record<string, string> = {};

  if (!source) return result;

  for (const [field, messages] of Object.entries(source)) {

    if (typeof messages === "string") {

      result[field] = messages;

    } else if (Array.isArray(messages) && typeof messages[0] === "string") {

      result[field] = messages[0];

    }

  }

  return result;

}

export function TransactionForm({ mode, transactionId, returnTo= "/transactions" }: TransactionFormProps) {

  const router = useRouter();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);

  const [type, setType] = useState<TransactionType>("expense");

  const [title, setTitle] = useState("");

  const [amount, setAmount] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [date, setDate] = useState(() => getTodayLocalDate());

  const [description, setDescription] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadTransaction = useCallback(async () => {

    if (mode !== "edit" || !transactionId) return;

    try {

      const response = await fetch(`/api/transactions/${transactionId}`);

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok || !data || typeof data !== "object") {

        throw new Error("Could not load the transaction.");

      }

      const transaction = data as ExistingTransaction;

      const amountValue =

        typeof transaction.amount === "object"

          ? transaction.amount.$numberDecimal

          : String(transaction.amount);

      setTitle(transaction.title);

      setAmount(amountValue);

      setType(transaction.type);

      setCategoryId(transaction.categoryId);

      setDate(transaction.date.slice(0, 10));

      setDescription(transaction.description ?? "");

    } catch {

      setError("Could not load the transaction. Please try again.");

    }

  }, [mode, transactionId]);

  useEffect(() => {

  async function loadCategories() {

    try {

      const response = await fetch("/api/categories");

      if (!response.ok) {

        throw new Error("Could not load categories.");

      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {

        throw new Error("The categories response has an invalid format.");

      }

      setCategories(data as Category[]);

    } catch {

      setError("Could not load categories. Please refresh and try again.");

    } finally {

      setLoadingCategories(false);

    }

  }

  loadCategories();

  void Promise.resolve().then(() => {

    void loadTransaction();

  });

}, [loadTransaction]);

const availableCategories = useMemo(

  () => categories.filter((category) => category.type === type),

  [categories, type],

);

function handleTypeChange(nextType: TransactionType) {

  setType(nextType);

  setCategoryId("");

  setFieldErrors({});

  setError("");

  }

async function handleSubmit(event: FormEvent<HTMLFormElement>) {

  event.preventDefault();

  setError("");

  setFieldErrors({});

  if (!categoryId) {

    setFieldErrors({

      categoryId: "Please select a category.",

    });

    return;

  }

  if (!date) {

    setFieldErrors({

      date: "Please select a date.",

    });

    return;

  }

  setSubmitting(true);

  try {

    const response = await fetch(

      mode === "create"

        ? "/api/transactions"

        : `/api/transactions/${transactionId}`,

      {

        method: mode === "create" ? "POST" : "PATCH",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          title: title.trim(),

          amount,

          type,

          categoryId,

          date,

          description: description.trim() || null,

        }),

    });

    const data: unknown = await response.json().catch(() => null);

    const apiData =

      data && typeof data === "object"

        ? (data as ApiErrorResponse)

        : null;

    if (!response.ok) {
      setFieldErrors(getFieldErrors(apiData));
      setError(getErrorMessage(apiData));
      return;
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      setError("The server returned an invalid response. Please try again.");
      return;
    }

    showToast(
      mode === "create"
        ? "Transaction created successfully."
        : "Transaction updated successfully.",
      "success",
    );

    router.push(returnTo);

    router.refresh();

  } catch {

    setError("Network error. Please check your connection and try again.");

  } finally {

    setSubmitting(false);

  }

}

  return (

    <div className="space-y-4">

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5">

        {error && (

          <p role="alert"

            className="rounded-md bg-red-50 p-3 text-sm text-red-700"

          >

            {error}

          </p>

        )}

        <div className="grid gap-1">

          <label htmlFor="type" className="text-sm font-medium text-zinc-800">

            Type

          </label>

          <select id="type" name="type" value={type} onChange={(e) => handleTypeChange(e.target.value as TransactionType)} disabled={submitting} className="rounded-md border border-zinc-300 px-3 py-2 text-sm">

            <option value="income">Income</option>

            <option value="expense">Expense</option>

          </select>

        </div>

        <div className="grid gap-1">

          <label htmlFor="tile" className="text-sm font-medium text-zinc-800">

            Title

          </label>

          <input id="tile" name="tile" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={submitting} className="rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="e.g. Grocery shopping" />

          {fieldErrors.title && (

            <p className="mt-1 text-sm text-red-500" role="alert">{fieldErrors.title}</p>

          )}

        </div>

        <div className="grid gap-1">

          <label htmlFor="amount" className="text-sm font-medium text-zinc-800">

            Amount (USD)

          </label>

          <input id="amount" name="amount" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={submitting} className="rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="0.00" />

          {fieldErrors.amount && (

            <p className="mt-1 text-sm text-red-500" role="alert">{fieldErrors.amount}</p>

          )}

        </div>

        <div className="grid gap-1">

          <label htmlFor="categoryId" className="text-sm font-medium text-zinc-800">

            Category

          </label>

          <select

            id="categoryId"

            name="categoryId"

            value={categoryId}

            onChange={(event) => setCategoryId(event.target.value)}

            required

            disabled={

              submitting ||

              loadingCategories ||

              availableCategories.length === 0

            }

            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"

          >

            <option value="">

              {loadingCategories

                ? "Loading categories..."

                : availableCategories.length === 0

                  ? "No categories available for this type"

                  : "Select a category"}

            </option>

            {availableCategories.map((category) => {

              const id = category._id ?? category.id;

              if (!id) return null;

              return (

                <option key={id} value={id}>

                  {category.name}

                </option>

              );

            })}

          </select>

          {fieldErrors.categoryId && (

            <p className="mt-1 text-sm text-red-500" role="alert">

              {fieldErrors.categoryId}

            </p>

          )}

          {!loadingCategories && categories.length === 0 && (

            <p className="mt-1 text-sm text-red-500" role="alert">

              Create a category before adding a transaction.

            </p>

          )}

        </div>

        <div className="grid gap-1">

          <label htmlFor="date" className="text-sm font-medium text-zinc-800">

            Date

          </label>

          <input id="date" name="date" type="date" value={date} max={getTodayLocalDate()} onChange={(e) => setDate(e.target.value)} required disabled={submitting} className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />

          {fieldErrors.date && (

            <p className="mt-1 text-sm text-red-500" role="alert">{fieldErrors.date}</p>

          )}

        </div>

        <div className="grid gap-1">

          <label htmlFor="description" className="text-sm font-medium text-zinc-800">

            Description (optional)

          </label>

          <textarea id="description" name="description" maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} disabled={submitting} className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="Add more details..." />

          {fieldErrors.description && (

            <p className="mt-1 text-sm text-red-500" role="alert">

              {fieldErrors.description}

            </p>

          )}

        </div>

        <button type="submit" disabled={submitting || loadingCategories} className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50">

          {submitting ? "Saving..." : mode === "create" ? "Create Transaction" : "Update Transaction"}

        </button>

      </form>

    </div>

  );

}
