import { AppError } from "../errors/app-error";

export async function parseJsonBody(
    request: Request
): Promise<unknown> {
    try {
        const rawBody = await request.text();
        const body: unknown = JSON.parse(rawBody);

        if (
            typeof body !== "object" ||
            body === null ||
            Array.isArray(body)
        ) {
            throw new AppError(
                "VALIDATION_ERROR",
                "Request body must be a JSON object.",
                400
            )
        }
        
        return body;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            "VALIDATION_ERROR",
            "Invalid JSON body.",
            400,
        )
    }
    
}