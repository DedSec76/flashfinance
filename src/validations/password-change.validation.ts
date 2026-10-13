import { z } from "zod";
import { RegisterSchema } from "@/validations/register.validation";

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: RegisterSchema.shape.password,
});

export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;