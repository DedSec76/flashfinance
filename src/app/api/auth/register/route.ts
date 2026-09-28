import { AppError } from "@/src/lib/errors/app-error";
import { registerService } from "@/src/services/register/register.service";
import { RegisterSchema } from "@/src/validations/register.validation";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = RegisterSchema.safeParse(body);

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

        const user = await registerService(result.data);

        return Response.json(user, { status: 201 });
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
                    message: "An unexpected error occurred.",
                },
            },
            { status: 500 }
        );
    }
}