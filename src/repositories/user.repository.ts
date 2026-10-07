import { User as UserModel } from "../lib/models/user.model";
import { connectToDatabase } from "../lib/mongodb/connection";

export async function findUserByEmail(email: string) {
    await connectToDatabase();

    return UserModel.findOne({ email })
}

export async function createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    avatar: string | null;
    status: "active" | "inactive";
    failedLoginAttempts: number;
    lockedUntil: Date | null;
}) {
    await connectToDatabase();

    return UserModel.create(userData);
}

export async function findUserById(userId: string) {
    await connectToDatabase();

    return UserModel.findById(userId).select("-passwordHash");
}

export async function incrementFailedLoginAttempts(userId: string) {
    await connectToDatabase();

    return UserModel.updateOne(
        { _id: userId },
        { $inc: { failedLoginAttempts: 1 } }
    )
}

export async function lockUser(userId: string, lockedUntil: Date) {
    await connectToDatabase();

    return UserModel.updateOne(
        { _id: userId },
        { $set: { lockedUntil } }
    )
}

export async function resetLoginAttempts(userId: string) {
    await connectToDatabase();

    return UserModel.updateOne(
        { _id: userId },
        { 
            $set: { 
                failedLoginAttempts: 0,
                lockedUntil: null,
            }, 
        }
    )
}