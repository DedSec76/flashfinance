import { AppError } from "@/lib/errors/app-error";
import { loginService } from "@/services/login/login.service";
import { LoginSchema } from "@/validations/login.validation";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const body = await request.json();

        const result = LoginSchema.safeParse(body)

        if(!result.success) {
            return Response.json(
                {
                    error: {
                        code: "LOGIN_INVALID",
                        message: "Failed Login",
                        fields: result.error.flatten().fieldErrors,
                    },
                },
                { status: 400 }
            )
        }

        let deviceId = cookieStore.get("deviceId")?.value
        
        if(!deviceId) {
            deviceId = crypto.randomUUID();

            cookieStore.set("deviceId", deviceId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            })
        }

        const { email, password } = result.data

        const session = await loginService(email, password, deviceId)

        cookieStore.set("sessionToken", session.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: session.expiresAt
        })

        return Response.json(
            {
                message: "Login successfully"
            },
            { status: 200 }
        )
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