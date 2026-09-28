import { z } from 'zod';

export const LoginSchema = z.object({
    email: z
        .email("Invalid email"),

    password: z 
        .string("Password is required")
        .min(10, "Password must contain at least 10 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});