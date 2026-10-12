"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export type TransactionFormCategory = {
  id: string;
  name: string;
  type: "income" | "expense";
};

export type TransactionFormValues = {
  title: string;
  amount: string;
  type: "income" | "expense";
  categoryId: string;
  description: string;
  date: string;
};

type TransactionFormProps = {
  mode: "create" | "edit";
  transactionId?: string;
  categories: TransactionFormCategory[];
  initialValues?: TransactionFormValues;
};

type FieldErrors = Partial<Record<keyof TransactionFormValues, string>>;

type FailureBody = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string[] | undefined>;
  };
};

function todayInputValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function emptyValues(categories: TransactionFormCategory[]): TransactionFormValues {
  return {
    title: "",
    amount: "",
    type: "expense",
    categoryId: categories.find((category) => category.type === "expense")?.id ?? "",
    description: "",
    date: todayInputValue(),
  };
}

function validate(values: TransactionFormValues, categories: TransactionFormCategory[]) {
  const errors: FieldErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();
  const amount = Number(values.amount);
  const category = categories.find((item) => item.id === values.categoryId);

  if (!title) {
    errors.title = "Title is required.";
  }

  const amountText = values.amount.trim();
  const fraction = amountText.split(".")[1] ?? "";

  if (!amountText) {
    errors.amount = "Amount is required.";
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than 0.";
  } else if (fraction.length > 2) {
    errors.amount = "Amount cannot have more than two decimal places.";
  }

  if (values.type !== "income" && values.type !== "expense") {
    errors.type = "Type must be income or expense.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Choose a category.";
  } else if (!/^[0-9a-fA-F]{24}$/.test(values.categoryId) || !category) {
    errors.categoryId = "Choose a category from the list.";
  } else if (category.type !== values.type) {
    errors.categoryId = "Choose a category that matches the transaction type.";
  }

  if (description.length > 1000) {
    errors.description = "Description cannot exceed 1,000 characters.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  } else if (values.date > todayInputValue()) {
    errors.date = "Date cannot be in the future.";
  }

  return errors;
}

async function readFailure(response: Response) {
  try {
    const body = (await response.json()) as FailureBody;
    const message = body.error?.message ?? "Something went wrong. Please try again.";
    const fields: FieldErrors = {
      title: body.error?.fields?.title?.[0],
      amount: body.error?.fields?.amount?.[0],
      type: body.error?.fields?.type?.[0],
      categoryId: body.error?.fields?.categoryId?.[0],
      description: body.error?.fields?.description?.[0],
      date: body.error?.fields?.date?.[0],
    };

    if (body.error?.code === "INVALID_AMOUNT") {
      fields.amount = message;
    }

    if (body.error?.code === "INVALID_DATE") {
      fields.date = message;
    }

    if (
      body.error?.code === "CATEGORY_NOT_FOUND" ||
      body.error?.code === "TRANSACTION_TYPE_MISMATCH"
    ) {
      fields.categoryId = message;
    }

    return { message, fields };
  } catch {
    return {
      message: "Something went wrong. Please try again.",
      fields: {},
    };
  }
}

export function TransactionForm({
  mode,
  transactionId,
  categories,
  initialValues,
}: TransactionFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<TransactionFormValues>(
    initialValues ?? emptyValues(categories),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pendingAction, setPendingAction] = useState<"save" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const pending = pendingAction !== null;
  const matchingCategories = categories.filter((category) => category.type === values.type);

  function updateField<Key extends keyof TransactionFormValues>(
    key: Key,
    value: TransactionFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleTypeChange(type: "income" | "expense") {
    setValues((current) => {
      const categoryStillMatches = categories.some(
        (category) => category.id === current.categoryId && category.type === type,
      );

      return {
        ...current,
        type,
        categoryId: categoryStillMatches
          ? current.categoryId
          : categories.find((category) => category.type === type)?.id ?? "",
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values, categories);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please correct the highlighted fields and try again.");
      return;
    }

    setPendingAction("save");
    setFormError("");

    try {
      const response = await fetch(
        mode === "edit" && transactionId
          ? `/api/transactions/${transactionId}`
          : "/api/transactions",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title.trim(),
            amount: Number(values.amount),
            type: values.type,
            categoryId: values.categoryId,
            description: values.description.trim() ? values.description.trim() : null,
            date: values.date,
          }),
        },
      );

      if (!response.ok) {
        const failure = await readFailure(response);
        setErrors(failure.fields);
        setFormError(failure.message);
        setPendingAction(null);
        return;
      }

      router.push("/transactions?saved=1");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setPendingAction(null);
    }
  }

  async function handleDelete() {
    if (!transactionId) {
      return;
    }

    setPendingAction("delete");
    setFormError("");

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const failure = await readFailure(response);
        setFormError(failure.message);
        setPendingAction(null);
        return;
      }

      router.push("/transactions?deleted=1");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setPendingAction(null);
    }
  }

  return (
    <div className="space-y-4">
      <form
        className="card"
        style={{ display: "grid", gap: "var(--space-md)" }}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={pending}
      >
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
            disabled={pending}
          />
          {errors.title ? (
            <p id="title-error" className="text-danger">
              {errors.title}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={values.type}
            onChange={(event) => handleTypeChange(event.target.value as "income" | "expense")}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? "type-error" : undefined}
            disabled={pending}
          >
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
          {errors.type ? (
            <p id="type-error" className="text-danger">
              {errors.type}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (USD)</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={values.amount}
            onChange={(event) => updateField("amount", event.target.value)}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            disabled={pending}
          />
          {errors.amount ? (
            <p id="amount-error" className="text-danger">
              {errors.amount}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            max={todayInputValue()}
            value={values.date}
            onChange={(event) => updateField("date", event.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "date-error" : undefined}
            disabled={pending}
          />
          {errors.date ? (
            <p id="date-error" className="text-danger">
              {errors.date}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={values.categoryId}
            onChange={(event) => updateField("categoryId", event.target.value)}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={errors.categoryId ? "category-error" : undefined}
            disabled={pending || matchingCategories.length === 0}
          >
            {matchingCategories.length === 0 ? (
              <option value="">No {values.type} categories yet</option>
            ) : (
              matchingCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          {matchingCategories.length === 0 ? (
            <p className="text-muted">
              Create a {values.type} category before saving this transaction.
            </p>
          ) : null}
          {errors.categoryId ? (
            <p id="category-error" className="text-danger">
              {errors.categoryId}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            maxLength={1000}
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
            disabled={pending}
          />
          {errors.description ? (
            <p id="description-error" className="text-danger">
              {errors.description}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className="alert alert-error" role="alert">
            {formError}
          </p>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={pending || matchingCategories.length === 0}>
          {pendingAction === "save"
            ? "Saving..."
            : mode === "create"
              ? "Create Transaction"
              : "Update Transaction"}
        </button>
      </form>

      {mode === "edit" && transactionId ? (
        <section className="card">
          <h2>Delete transaction</h2>
          <p className="text-muted" style={{ marginTop: "var(--space-sm)" }}>
            This permanently removes the transaction from your account.
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
            {confirmDelete ? (
              <>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={pending}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" type="button" onClick={handleDelete} disabled={pending}>
                  {pendingAction === "delete" ? "Deleting..." : "Confirm delete"}
                </button>
              </>
            ) : (
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={pending}
              >
                Delete
              </button>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
