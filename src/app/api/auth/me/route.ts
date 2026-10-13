import { cookies } from "next/headers";

import { getCurrentUserId } from "@/lib/auth/current-user";
import { errorResponse, validationError } from "@/lib/http/error-response";
import { updateProfileService } from "@/src/services/profile/profile.service";
import { ProfileSchema } from "@/src/validations/profile.validation";
import { AppError } from "@/lib/errors/app-error";
import { getUserBySessionToken } from "@/services/session/session.service";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get("sessionToken")?.value;

		if (!sessionToken) {
			throw new AppError(
				"SESSION_INVALID",
				"Authentication required.",
				401
			);
		}

		const user = await getUserBySessionToken(sessionToken);

		return Response.json(user, { status: 200 });
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

export async function PATCH(request: Request) {
	try {
		const body = await request.json().catch(() => null);
		const result = ProfileSchema.safeParse(body);

		if (!result.success) {
			const flattened = result.error.flatten();

			return validationError(
				flattened.fieldErrors,
				flattened.formErrors[0] ?? "Invalid request data.",
			)
		}

		const userId = await getCurrentUserId();

		const updatedUser = await updateProfileService(
			userId,
			result.data,
		);

		return Response.json(updatedUser, { status: 200 });
	} catch (error) {
		return errorResponse(error);
	}
}
