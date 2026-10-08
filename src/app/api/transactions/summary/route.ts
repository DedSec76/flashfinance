import { getCurrentUserId } from "@/lib/auth/current-user";
import { errorResponse, validationError } from "@/lib/http/error-response";
import { getMonthlyTransactionSummaryService } from "@/services/transaction/transaction.service";
import { transactionSummarySchema } from "@/validations/transaction.validation";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const month = searchParams.get("month");

        const result = transactionSummarySchema.safeParse({ month });

        if (!result.success) {
            const flattened = result.error.flatten();

            return validationError(
                flattened.fieldErrors,
                flattened.formErrors[0] ?? "Invalid request data.",
            );
        }

        const userId = await getCurrentUserId();

        const summary = await getMonthlyTransactionSummaryService(userId, result.data.month);

        return Response.json(summary);
    } catch (error) {
        return errorResponse(error);
    }
}