"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/providers/toast-provider";
import type { CategoryView } from "@/src/services/category/category.service";

type CategoryManagerProps = {
  categories: CategoryView[];
  returnTo?: string;
};

type FieldErrors = {
  name?: string;
  type?: string;
};

async function readFailure(response: Response) {
  try {
    const body = (await response.json()) as {
      error?: {
        message?: string;
        fields?: Record<string, string[] | undefined>;
      };
    };

    return {
      message: body.error?.message ?? "Something went wrong. Please try again.",
      fields: {
        name: body.error?.fields?.name?.[0],
        type: body.error?.fields?.type?.[0],
      },
    };
  } catch {
    return {
      message: "The server returned an invalid response. Please try again.",
      fields: {},
    };
  }
}

export function CategoryManager({
  categories,
  returnTo = "/categories",
}: CategoryManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const editing = categories.find((category) => category.id === editingId) ?? null;
  const typeLocked = Boolean(editing && editing.transactionCount > 0);

  function beginEdit(category: CategoryView) {
    setEditingId(category.id);
    setName(category.name);
    setType(category.type);
    setErrors({});
    setFormError("");
    setPendingDeleteId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setType("expense");
    setErrors({});
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const nextErrors: FieldErrors = {};

    if (!trimmedName) {
      nextErrors.name = "Category name is required.";
    }

    if (type !== "income" && type !== "expense") {
      nextErrors.type = "Type must be income or expense.";
    }

    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.type) {
      setFormError("Please correct the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch(
        editing ? `/api/categories/${editing.id}` : "/api/categories",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            type,
          }),
        },
      );

      if (!response.ok) {
        const failure = await readFailure(response);
        setErrors(failure.fields);
        setFormError(failure.message);
        showToast(failure.message, "error");
        return;
      }

      // The API is expected to return JSON for successful create/update requests.
      const result: unknown = await response.json().catch(() => null);

      if (!result || typeof result !== "object") {
        const message = "The server returned an invalid response. Please try again.";
        setFormError(message);
        showToast(message, "error");
        return;
      }

      if (editing) {
        cancelEdit();
        showToast("Category updated successfully.", "success");
        router.refresh();
        return;
      }

      showToast("Category created successfully.", "success");
      router.push(returnTo);
      router.refresh();
    } catch {
      const message =
        "Network error. Please check your connection and try again.";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete(categoryId: string) {
    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const failure = await readFailure(response);
        setFormError(failure.message);
        showToast(failure.message, "error");
        return;
      }

      if (editingId === categoryId) {
        cancelEdit();
      }

      setPendingDeleteId(null);
      showToast("Category deleted successfully.", "success");
      router.refresh();
    } catch {
      const message =
        "Network error. Please check your connection and try again.";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <form className="card form-panel" onSubmit={handleSubmit} noValidate>
        <h2>{editing ? "Edit category" : "New category"}</h2>

        <div className="form-group">
          <label htmlFor="category-name">Category name</label>
          <input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "category-name-error" : undefined}
            disabled={submitting}
          />
          {errors.name ? (
            <p id="category-name-error" className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="category-type">Type</label>
          <select
            id="category-type"
            value={type}
            onChange={(event) =>
              setType(event.target.value as "income" | "expense")
            }
            aria-invalid={Boolean(errors.type)}
            aria-describedby={
              errors.type
                ? "category-type-error"
                : typeLocked
                  ? "category-type-note"
                  : undefined
            }
            disabled={submitting || typeLocked}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {typeLocked ? (
            <p id="category-type-note" className="text-muted">
              This category has transactions, so its type stays the same.
            </p>
          ) : null}

          {errors.type ? (
            <p id="category-type-error" className="field-error">
              {errors.type}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className="alert alert-error" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="form-actions">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : editing
                ? "Save changes"
                : "Save category"}
          </button>

          {editing ? (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={cancelEdit}
              disabled={submitting}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {categories.length === 0 ? (
        <div className="card stack">
          <h2>Your categories</h2>
          <p className="text-muted">
            No categories yet. Create one to organize income and expenses.
          </p>
        </div>
      ) : (
        <section className="card stack">
          <h2>Your categories</h2>
          <ul className="transaction-list">
            {categories.map((category) => (
              <li key={category.id} className="transaction-item">
                <div>
                  <p className="item-title">{category.name}</p>
                  <span
                    className={
                      category.type === "income"
                        ? "badge badge-income"
                        : "badge badge-expense"
                    }
                  >
                    {category.type}
                  </span>
                  <p className="text-muted">
                    {category.transactionCount === 0
                      ? "No transactions yet"
                      : `${category.transactionCount} transaction${category.transactionCount === 1 ? "" : "s"}`}
                  </p>
                </div>

                <div className="item-actions">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => beginEdit(category)}
                    disabled={submitting}
                  >
                    Edit
                  </button>

                  {category.transactionCount > 0 ? (
                    <button className="btn btn-danger" type="button" disabled>
                      Delete
                      <span className="sr-only">
                        . Categories with transactions cannot be deleted.
                      </span>
                    </button>
                  ) : pendingDeleteId === category.id ? (
                    <>
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => setPendingDeleteId(null)}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => confirmDelete(category.id)}
                        disabled={submitting}
                      >
                        {submitting ? "Deleting..." : "Confirm delete"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => setPendingDeleteId(category.id)}
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {categories.some((category) => category.transactionCount > 0) ? (
            <p className="text-muted">
              Categories with transactions can be renamed. Their type cannot
              change, and they cannot be deleted.
            </p>
          ) : null}
        </section>
      )}
    </div>
  );
}
