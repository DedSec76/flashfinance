import { hashSessionToken } from "@/lib/auth/session";
import { deleteSessionByTokenHash } from "@/repositories/session.repository";

export async function logoutService(token: string) {
            
    const tokenHash = hashSessionToken(token)
    
    return deleteSessionByTokenHash(tokenHash)
}