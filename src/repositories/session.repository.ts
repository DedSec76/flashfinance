import { Session as SessionModel } from "../lib/models/session.model";
import { connectToDatabase } from "../lib/mongodb/connection";

export async function findSessionByTokenHash(tokenHash: string) {
    await connectToDatabase();

    return SessionModel.findOne({ tokenHash })
}

export async function createSession(
    userId: string,
    deviceId: string,
    tokenHash: string,
    expiresAt: Date,
    lastUsedAt: Date
) {
    await connectToDatabase();

    return SessionModel.create({
        userId, 
        deviceId, 
        tokenHash, 
        expiresAt, 
        lastUsedAt
    })
}

export async function deleteSessionByTokenHash(tokenHash: string) {
    await connectToDatabase();

    return SessionModel.findOneAndDelete({
        tokenHash
    })
}