import { z } from "zod";

export const ProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters")
    .max(80, "First name cannot exceed 80 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters")
    .max(80, "Last name cannot exceed 80 characters"),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;