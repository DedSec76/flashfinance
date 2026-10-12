import { AppError } from "@/lib/errors/app-error";
import { findUserByEmail, registerFailedLoginAttempt, resetLoginAttempts } from "@/repositories/user.repository"
import { createSessionService } from "../session/session.service";
import bcrypt from "bcryptjs";

export async function loginService(email: string, password: string, deviceId: string) {
    // 1. Buscar usuario
    const user = await findUserByEmail(email)
    
    // 2. ¿Existe?
    if(!user) {
        throw new AppError(
            "LOGIN_INVALID",
            "Invalid email or password",
            401
        );
    }

    // 3. ¿Está activo?
    if(user.status === "inactive") {
        throw new AppError(
            "LOGIN_FAILED",
            "User is inactive.",
            401
        );
    }
        
    // 4. ¿Está bloqueado?
    if(user.lockedUntil && user.lockedUntil > new Date()) {
        throw new AppError(
            "LOGIN_LOCKED",
            "Your account is temporarily locked. Please try again later.",
            423,
        );
    }
        
    // 5. Verificar password
    const compare = await bcrypt.compare(password, user.passwordHash)
    
    // 6. Si falla → incrementar intentos
    if(!compare) {
        const result = await registerFailedLoginAttempt(user.id);

        if(result.locked) {
            throw new AppError(
                "LOGIN_LOCKED",
                "Your account has been temporarily locked for 10 minutes. Please try again later.",
                423,
            );
        }

        const attempts = result.attemptsLeft;
        const attemptMessage = 
            attempts === 1 ? "You have 1 attempt remaining." : `You have ${attempts} attempts remaining.`;
        
        throw new AppError(
            "LOGIN_FAILED",
            `Incorrect password. ${attemptMessage}`,
            400
        )
    }

    // 7. Si es correcto → crear sesión
    await resetLoginAttempts(user.id)
    const session = await createSessionService(user.id, deviceId) 

    // 8. devolver sesión
    return session
}