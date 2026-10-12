import { AppError } from "@/lib/errors/app-error";
import { findUserByEmail, incrementFailedLoginAttempts, lockUser, resetLoginAttempts } from "@/repositories/user.repository"
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
            "LOGIN_FAILED",
            `User is locked until ${user.lockedUntil}`,
            400
        );
    }
        
    // 5. Verificar password
    const compare = await bcrypt.compare(password, user.passwordHash)
    
    // 6. Si falla → incrementar intentos
    if(!compare) {
        const failedAttempts = user.failedLoginAttempts + 1;
        await incrementFailedLoginAttempts(user.id)

        if(failedAttempts >= 3) {
            const lockedUntil = new Date(Date.now() + 10 * 60 * 1000)
            
            await lockUser(user.id, lockedUntil)
            
            throw new AppError(
                "LOGIN_FAILED",
                `User is temporarily locked.`,
                400
            )
        }

        const attemptsLeft = 3 - failedAttempts;
        
        throw new AppError(
            "LOGIN_FAILED",
            `error: you have left ${attemptsLeft} attempts`,
            400
        )
    }

    // 7. Si es correcto → crear sesión
    await resetLoginAttempts(user.id)
    const session = await createSessionService(user.id, deviceId) 

    // 8. devolver sesión
    return session
}