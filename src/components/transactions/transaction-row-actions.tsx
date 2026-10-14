"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { useToast } from "@/components/providers/toast-provider";

type TransactionRowActionsProps = {
  id: string;
  returnTo: string;
};

export function TransactionRowActions({
  id,
  returnTo,
}: TransactionRowActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "object" &&
          data.error !== null &&
          "message" in data.error &&
          typeof data.error.message === "string"
            ? data.error.message
            : "Could not delete the transaction. Please try again.";

        setError(message);
        showToast(message, "error");
        return;
      }

      setIsDialogOpen(false);
      showToast("Transaction deleted successfully.", "success");
      router.push(returnTo);
      router.refresh();
    } catch {
      const message =
        "Network error. Please check your connection and try again.";

      setError(message);
      showToast(message, "error");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleClose() {
    if (isDeleting) return;

    setIsDialogOpen(false);
    setError("");
  }

  return (
    <>
      <div className="flex gap-2 text-xs">
        <Link
          className="rounded border border-zinc-300 px-2 py-1 hover:bg-zinc-100"
          href={`/transactions/${id}/edit?returnTo=${encodeURIComponent(returnTo)}`}
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => {
            setError("");
            setIsDialogOpen(true);
          }}
          className="rounded border border-red-300 px-2 py-1 text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {isDialogOpen && (
        <ConfirmDialog
          title="Delete transaction?"
          description="This action cannot be undone. The transaction will be permanently removed from your account."
          confirmLabel="Delete transaction"
          isLoading={isDeleting}
          error={error}
          onConfirm={handleDelete}
          onClose={handleClose}
        />
      )}
    </>
  );
}
