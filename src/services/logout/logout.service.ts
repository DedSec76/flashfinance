import { hashSessionToken } from "@/src/lib/auth/session";
import { deleteSessionByTokenHash } from "@/src/repositories/session.repository";

export async function logoutService(token: string) {
            
    const tokenHash = hashSessionToken(token)
    
    return deleteSessionByTokenHash(tokenHash)
}