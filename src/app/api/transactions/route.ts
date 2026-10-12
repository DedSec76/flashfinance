import { createTransactionService, getTransactionsService } from "@/src/services/transaction/transaction.service";
import { transactionFiltersSchema, transactionSchema } from "@/src/validations/transaction.validation";
import { errorResponse, validationError } from "@/lib/http/error-response";
import { getCurrentUserId } from "@/lib/auth/current-user";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);

        const result = transactionSchema.safeParse(body);

        if (!result.success) {
            const flattened = result.error.flatten();

            return validationError(
                flattened.fieldErrors,
                flattened.formErrors[0] ?? "Invalid request data.",
            );
        }

        const userId = await getCurrentUserId();

        const transaction = await createTransactionService(userId, result.data);

        // Response
        return Response.json(transaction, { status: 201 });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            type: searchParams.get("type") ?? undefined,
            categoryId: searchParams.get("categoryId") ?? undefined,
            startDate: searchParams.get("startDate") ?? undefined,
            endDate: searchParams.get("endDate") ?? undefined,
            month: searchParams.get("month") ?? undefined,
            minAmount: searchParams.get("minAmount") ?? undefined,
            maxAmount: searchParams.get("maxAmount") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
        }

        const result = transactionFiltersSchema.safeParse(filters);

        if (!result.success) {
            const flattened = result.error.flatten();

            return validationError(
                flattened.fieldErrors,
                flattened.formErrors[0] ?? "Invalid request data."
            )
        }

        const userId = await getCurrentUserId();
        
        const transactions = await getTransactionsService(userId, result.data);

        return Response.json(transactions);
    } catch (error) {
        return errorResponse(error);
    }
}