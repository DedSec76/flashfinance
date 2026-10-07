import { cookies } from "next/headers";

import { AppError } from "@/src/lib/errors/app-error";
import { getSessionByToken } from "@/src/services/session/session.service";
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
		const cookieStore = await cookies();
		const token = cookieStore.get("sessionToken")?.value;

		if (!token) {
			throw new AppError(
				"SESSION_INVALID",
				"Authentication required.",
				401
			);
		}

		const userId = await getSessionByToken(token);
		const transaction = await getTransactionByIdService(id, userId.toString());

		return Response.json(transaction, { status: 200 });
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
		);
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
			return Response.json(
				{
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid request data.",
						fields: result.error.flatten().fieldErrors,
					},
				},
				{ status: 400 }
			);
		}

		const cookieStore = await cookies();
		const token = cookieStore.get("sessionToken")?.value;

		if (!token) {
			throw new AppError(
				"SESSION_INVALID",
				"Authentication required.",
				401
			);
		}

		const userId = await getSessionByToken(token);
		const transaction = await updateTransactionService(
			id,
			userId.toString(),
			result.data
		);

		return Response.json(transaction, { status: 200 });
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
		);
	}
}

export async function DELETE(
	_request: Request,
	{ params }: TransactionRouteContext
) {
	try {
		const { id } = await params;
		const cookieStore = await cookies();
		const token = cookieStore.get("sessionToken")?.value;

		if (!token) {
			throw new AppError(
				"SESSION_INVALID",
				"Authentication required.",
				401
			);
		}

		const userId = await getSessionByToken(token);
		await deleteTransactionService(id, userId.toString());

		return Response.json(
			{ message: "Transaction deleted successfully." },
			{ status: 200 }
		);
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
		);
	}
}
