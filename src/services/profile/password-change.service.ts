import bcrypt from "bcryptjs";

import { AppError } from "@/lib/errors/app-error";
import { findUserByIdWithPassword, updateUserPassword } from "@/repositories/user.repository";
import type { PasswordChangeInput } from "@/validations/password-change.validation";

export async function changePasswordService(
    userId: string,
    input: PasswordChangeInput,
) {
    const user = await findUserByIdWithPassword(userId);

    if (!user) {
        throw new AppError(
            "USER_NOT_FOUND",
            "User not found",
            404
        );
    }

    const currentPasswordIsValid = await bcrypt.compare(
        input.currentPassword,
        user.passwordHash,
    );

    if (!currentPasswordIsValid) {
        throw new AppError(
            "CURRENT_PASSWORD_INVALID",
            "Current password is incorrect.",
            400,
        );
    }

    const newPasswordIsSame = await bcrypt.compare(
        input.newPassword,
        user.passwordHash,
    );

    if (newPasswordIsSame) {
        throw new AppError(
            "PASSWORD_UNCHANGED",
            "The new password must be different from the current password.",
            400,
        );
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);

    await updateUserPassword(userId, passwordHash);

    return { message: "Password updated successfully." };
}