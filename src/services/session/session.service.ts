import { createSession, findSessionByTokenHash } from "@/repositories/session.repository"
import { findUserById } from "@/repositories/user.repository";
import { generateToken, hashSessionToken } from "@/lib/auth/session";
import { AppError } from "@/lib/errors/app-error";

export async function getSessionByToken(token: string) {
    const tokenHash = hashSessionToken(token);

    const session = await findSessionByTokenHash(tokenHash)

    if (!session) { 
        throw new AppError(
            "SESSION_INVALID",
            "Session doesn't exist",
            401
        )
    }

    if (session.expiresAt <= new Date()) { 
        throw new AppError(
            "SESSION_EXPIRED",
            "Session has expired",
            401
        )
    }

    return session.userId
}

export async function getUserBySessionToken(token: string) {
    const userId = await getSessionByToken(token);
    const user = await findUserById(userId.toString());

    if (!user) {
        throw new AppError(
            "USER_NOT_FOUND",
            "User not found.",
            404
        );
    }

    return user;
}

export async function createSessionService(userId: string, deviceId: string) {
    const today = Date.now();
    
    const token = generateToken();

    const tokenHash = hashSessionToken(token)

    const expiresAt = new Date(today + 1000 * 60 * 60 * 24 * 7)

    const lastUsedAt = new Date(today)

    await createSession(userId, deviceId, tokenHash, expiresAt, lastUsedAt);

    return { token, expiresAt }
}