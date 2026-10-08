import { createTransactionService, getTransactionsService } from "@/src/services/transaction/transaction.service";
import { transactionSchema } from "@/src/validations/transaction.validation";
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

export async function GET() {
    try {
        const userId = await getCurrentUserId();
        
        const transactions = await getTransactionsService(userId);

        return Response.json(transactions);
    } catch (error) {
        return errorResponse(error);
    }
}