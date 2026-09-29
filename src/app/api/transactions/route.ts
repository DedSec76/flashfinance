import { cookies } from "next/headers";

import { AppError } from "@/lib/errors/app-error";
import { getSessionByToken } from "@/services/session/session.service";
import {
  createTransactionService,
  getTransactionsService,
} from "@/services/transaction/transaction.service";
import { transactionSchema } from "@/validations/transaction.validation";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionToken")?.value;

    if (!token) {
      throw new AppError("SESSION_INVALID", "Authentication required.", 401);
    }

    const userId = await getSessionByToken(token);

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (month) {
      const [year, monthNumber] = month.split("-").map(Number);

      if (
        !Number.isInteger(year) ||
        !Number.isInteger(monthNumber) ||
        monthNumber < 1 ||
        monthNumber > 12
      ) {
        return Response.json(
          {
            error: {
              code: "INVALID_MONTH",
              message: "Month must use YYYY-MM format.",
            },
          },
          { status: 400 },
        );
      }

      startDate = new Date(year, monthNumber - 1, 1);
      endDate = new Date(year, monthNumber, 1);
    }

    const transactions = await getTransactionsService(
      userId.toString(),
      startDate,
      endDate,
    );

    return Response.json(transactions);
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.statusCode },
      );
    }

    return Response.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
        },
      },
      { status: 500 },
    );
  }
}

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
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("sessionToken")?.value;

    if (!token) {
      throw new AppError("SESSION_INVALID", "Authentication required.", 401);
    }

    const userId = await getSessionByToken(token);

    const transaction = await createTransactionService(
      userId.toString(),
      result.data,
    );

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
        { status: error.statusCode },
      );
    }

    return Response.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
        },
      },
      { status: 500 },
    );
  }
}
