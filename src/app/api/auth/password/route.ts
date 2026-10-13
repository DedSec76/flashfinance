import { getCurrentUserId } from "@/lib/auth/current-user";
import { errorResponse, validationError } from "@/lib/http/error-response";
import { changePasswordService } from "@/services/profile/password-change.service";
import { PasswordChangeSchema } from "@/validations/password-change.validation";

export async function PATCH(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const result = PasswordChangeSchema.safeParse(body);

        if (!result.success) {
            const flattened = result.error.flatten();

            return validationError(
                flattened.fieldErrors,
                flattened.formErrors[0] ?? "Invalid request data.",
            )
        }

        const userId = await getCurrentUserId();

        const response = await changePasswordService(userId, result.data);

        return Response.json(response, { status: 200 });
    } catch (error) {
        return errorResponse(error);
    }
}