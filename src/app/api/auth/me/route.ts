import { cookies } from "next/headers";

import { AppError } from "@/src/lib/errors/app-error";
import { getUserBySessionToken } from "@/src/services/session/session.service";

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
