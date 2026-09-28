import { z } from 'zod';

export const RegisterSchema = z.object({
    firstName: z
        .string("First name is required")
        .min(2, "First name must contain at least 2 characters"),

    lastName: z
        .string("Last name is required")
        .min(2, "Last name must contain at least 2 characters"),

    email: z
        .email("Invalid email"),

    password: z
        .string("Password is required")
        .min(10, "Password must contain at least 10 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;