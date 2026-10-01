import { AppError } from "@/src/lib/errors/app-error";
import { logoutService } from "@/src/services/logout/logout.service";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken")?.value

        if(!sessionToken) {
            throw new AppError(
                "SESSION_INVALID",
                "Authentication required.",
                401,
            )
        }

        await logoutService(sessionToken)

        cookieStore.delete("sessionToken");

        return Response.json(
            {
                message: "Logout successfully"
            }, { status: 200 }
        )
        
    } catch(error) {
        if (error instanceof AppError) {
            return Response.json(
                {
                    error: {
                        code: error.code,
                        message: error.message,
                    },
                },
                { 
                    status: error.statusCode 
                }
            );
        }
                
        return Response.json(
            {
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An unexpected error occurred."
                },
            },
            { 
                status: 500 
            }
        )
    }
}