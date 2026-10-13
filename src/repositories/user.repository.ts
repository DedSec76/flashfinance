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

export async function updateUserProfile(
    userId: string, 
    data: {
        firstName: string;
        lastName: string;
    },
) {
    await connectToDatabase();

    return UserModel.findByIdAndUpdate(
        userId,
        { $set: data },
        {
            new: true,
            runValidators: true,
        },
    ).select("-passwordHash");
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

export async function registerFailedLoginAttempt(userId: string) {
    await connectToDatabase();

    const now = new Date();
    const lockedUntil = new Date(now.getTime() + 10 * 60 * 1000);

    const user = await UserModel.findOneAndUpdate(
        {
            _id: userId,
            status: "active",
            $or: [
                { lockedUntil: null },
                { lockedUntil: { $exists: false } },
                { lockedUntil: { $lte: now } },
            ],
        },
        [
            {
                $set: {
                    failedLoginAttempts: {
                        $add: [
                            {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: [{ $isNull: ["$lockedUntil", null] }, null] },
                                            { $lte: ["$lockedUntil", now] },
                                        ],
                                    },
                                    0,
                                    { $ifNull: ["$failedLoginAttempts", 0] },
                                ],
                            },
                            1,
                        ],
                    },
                },
            },
            {
                $set: {
                    lockedUntil: {
                        $cond: [
                            { $gte: ["$failedLoginAttempts", 3] },
                            lockedUntil,
                            null
                        ],
                    },
                },
            },
        ],
        { returnDocument: "after" },
    );

    if (!user) {
        return { 
            locked: true,
            attemptsLeft: 0,
            lockedUntil: null, 
        };
    }

    const isLocked = 
        user.lockedUntil !== null &&
        user.lockedUntil !== undefined &&
        user.lockedUntil > now;

    return { 
        locked: isLocked,
        attemptsLeft: Math.max(0, 3 - user.failedLoginAttempts),
        lockedUntil: isLocked ? user.lockedUntil : null,
    };
}

export async function findUserByIdWithPassword(userId: string) {
    await connectToDatabase();

    return UserModel.findById(userId);
}

export async function updateUserPassword(
    userId: string,
    passwordHash: string,
) {
    await connectToDatabase();

    return UserModel.findByIdAndUpdate(
        userId,
        { $set: { passwordHash } },
        { new: true },
    ).select("-passwordHash");
}