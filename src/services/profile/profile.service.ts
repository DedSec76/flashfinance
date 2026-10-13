import { AppError } from "@/lib/errors/app-error";
import { updateUserProfile } from "@/repositories/user.repository";
import { ProfileInput } from "@/validations/profile.validation";

export async function updateProfileService(
    userId: string,
    input: ProfileInput,
) {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();

    const user = await updateUserProfile(userId, {
        firstName,
        lastName
    });

    if (!user) {
        throw new AppError(
            "USER_NOT_FOUND",
            "User not found.",
            404,
        );
    }

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
    }
    
}