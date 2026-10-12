import { logoutService } from "@/services/logout/logout.service";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken")?.value

        if (sessionToken) {
            await logoutService(sessionToken);
        }

        cookieStore.delete("sessionToken");

        return Response.json(
            {
                message: "Logout successfully"
            }, { status: 200 }
        )
        
    } catch {   
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