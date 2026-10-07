"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { CategoryView } from "@/src/services/category/category.service";

type CategoryManagerProps = {
  categories: CategoryView[];
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
      message: "Something went wrong. Please try again.",
      fields: {},
    };
  }
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
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
      const response = await fetch(editing ? `/api/categories/${editing.id}` : "/api/categories", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          type,
        }),
      });

      if (!response.ok) {
        const failure = await readFailure(response);
        setErrors(failure.fields);
        setFormError(failure.message);
        return;
      }

      cancelEdit();
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete(categoryId: string) {
    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });

      if (!response.ok) {
        const failure = await readFailure(response);
        setFormError(failure.message);
        return;
      }

      if (editingId === categoryId) {
        cancelEdit();
      }

      setPendingDeleteId(null);
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>{editing ? "Edit category" : "New category"}</h2>
        <div className="form-group" style={{ marginTop: "var(--space-md)" }}>
          <label htmlFor="category-name">Category name</label>
          <input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            disabled={submitting}
          />
          {errors.name ? <p className="text-danger">{errors.name}</p> : null}
        </div>
        <div className="form-group" style={{ marginTop: "var(--space-md)" }}>
          <label htmlFor="category-type">Type</label>
          <select
            id="category-type"
            value={type}
            onChange={(event) => setType(event.target.value as "income" | "expense")}
            aria-invalid={Boolean(errors.type)}
            disabled={submitting || typeLocked}
          >
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
          {typeLocked ? (
            <p className="text-muted">This category has transactions, so its type stays the same.</p>
          ) : null}
          {errors.type ? <p className="text-danger">{errors.type}</p> : null}
        </div>
        {formError ? (
          <p className="alert alert-error" style={{ marginTop: "var(--space-md)" }}>
            {formError}
          </p>
        ) : null}
        <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-lg)" }}>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editing ? "Save changes" : "Save category"}
          </button>
          {editing ? (
            <button className="btn btn-secondary" type="button" onClick={cancelEdit} disabled={submitting}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {categories.length === 0 ? (
        <div className="card">
          <h2>Your categories</h2>
          <p className="text-muted">No categories yet. Create one to organize income and expenses.</p>
        </div>
      ) : (
        <section className="card">
          <h2>Your categories</h2>
          <ul className="transaction-list" style={{ marginTop: "var(--space-md)" }}>
            {categories.map((category) => (
              <li key={category.id} className="transaction-item">
                <div>
                  <p style={{ color: "var(--color-heading)", fontWeight: 600 }}>{category.name}</p>
                  <span className={category.type === "income" ? "badge badge-income" : "badge badge-expense"}>
                    {category.type}
                  </span>
                  <p className="text-muted">
                    {category.transactionCount === 0
                      ? "No transactions yet"
                      : `${category.transactionCount} transaction${category.transactionCount === 1 ? "" : "s"}`}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <button className="btn btn-secondary" type="button" onClick={() => beginEdit(category)} disabled={submitting}>
                    Edit
                  </button>
                  {category.transactionCount > 0 ? (
                    <button className="btn btn-danger" type="button" disabled>
                      Delete
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
                        Confirm delete
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
            <p className="text-muted" style={{ marginTop: "var(--space-md)" }}>
              Categories with transactions can be renamed. Their type cannot change, and they cannot be deleted.
            </p>
          ) : null}
        </section>
      )}
    </div>
  );
}
