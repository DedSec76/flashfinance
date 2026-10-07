import { AppError } from "@/src/lib/errors/app-error";

export function errorResponse(error: unknown) {
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

export function validationError(
  fields: Record<string, string[] | undefined>,
  message = "Invalid request data.",
) {
  return Response.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message,
        fields,
      },
    },
    { status: 400 },
  );
}
