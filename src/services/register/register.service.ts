import bcrypt from "bcryptjs";

import { AppError } from "@/lib/errors/app-error";
import { createUser, findUserByEmail } from "@/repositories/user.repository";
import type { RegisterInput } from "@/validations/register.validation";

export async function registerService(data: RegisterInput) {
    const existingUser = await findUserByEmail(data.email);

    if (existingUser) {
        throw new AppError(
            "EMAIL_ALREADY_EXISTS",
            "An account with this email already exists.",
            409
        );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
        status: "active",
        avatar: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
    });

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
    };
}