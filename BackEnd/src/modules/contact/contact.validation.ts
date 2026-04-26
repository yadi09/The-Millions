import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
  serviceId: z.string().uuid("Invalid service ID format"),
});
