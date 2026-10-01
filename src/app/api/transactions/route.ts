import { cookies } from "next/headers";

import { AppError } from "@/src/lib/errors/app-error";
import { getSessionByToken } from "@/src/services/session/session.service";
import { createTransactionService } from "@/src/services/transaction/transaction.service";
import { transactionSchema } from "@/src/validations/transaction.validation";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = transactionSchema.safeParse(body);

        if (!result.success) {
            return Response.json(
                {
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid request data.",
                        fields: result.error.flatten().fieldErrors,
                    },
                },
                { status: 400 }
            )
        }

        // Get Cookie
        const cookieStore = await cookies();
        const token = cookieStore.get("sessionToken")?.value;

        if (!token) {
            throw new AppError(
                "SESSION_INVALID",
                "Authentication required.",
                401
            );
        }
        
        // Get UserId from Session
        const userId = await getSessionByToken(token);

        // Create Transaction
        const transaction = await createTransactionService(userId.toString(), result.data);
            
        // Response
        return Response.json(transaction, { status: 201 });
    } catch (error) {
        if (error instanceof AppError) {
            return Response.json(
                {
                    error: {
                        code: error.code,
                        message: error.message,
                    },
                },
                { status: error.statusCode }
            );
        }

        return Response.json(
            {
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An unexpected error occurred."
                },
            },
            { status: 500 }
        )
    }
}