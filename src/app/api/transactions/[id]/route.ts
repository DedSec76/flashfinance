import { getCurrentUserId } from "@/src/lib/auth/current-user";
import { errorResponse, validationError } from "@/src/lib/http/error-response";
import {
	deleteTransactionService,
	getTransactionByIdService,
	updateTransactionService,
} from "@/src/services/transaction/transaction.service";
import { updateTransactionSchema } from "@/src/validations/transaction.validation";

type TransactionRouteContext = {
	params: Promise<{ id: string }>;
};

export async function GET(
	_request: Request,
	{ params }: TransactionRouteContext
) {
	try {
		const { id } = await params;
		const userId = await getCurrentUserId();
		const transaction = await getTransactionByIdService(id, userId);

		return Response.json(transaction, { status: 200 });
	} catch (error) {
		return errorResponse(error);
	}
}

export async function PATCH(
	request: Request,
	{ params }: TransactionRouteContext
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const result = updateTransactionSchema.safeParse(body);

		if (!result.success) {
			const flattened = result.error.flatten();

			return validationError(
				flattened.fieldErrors,
				flattened.formErrors[0] ?? "Invalid request data.",
			);
		}

		const userId = await getCurrentUserId();
		const transaction = await updateTransactionService(
			id,
			userId,
			result.data
		);

		return Response.json(transaction, { status: 200 });
	} catch (error) {
		return errorResponse(error);
	}
}

export async function DELETE(
	_request: Request,
	{ params }: TransactionRouteContext
) {
	try {
		const { id } = await params;
		const userId = await getCurrentUserId();
		await deleteTransactionService(id, userId);

		return Response.json(
			{ message: "Transaction deleted successfully." },
			{ status: 200 }
		);
	} catch (error) {
		return errorResponse(error);
	}
}
