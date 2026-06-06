import { z } from "zod";

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(12, "New password must be at least 12 characters")
        .max(128, "New password must be at most 128 characters"),
});

export const changeEmailSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newEmail: z.string().trim().toLowerCase().email("Invalid email address"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;