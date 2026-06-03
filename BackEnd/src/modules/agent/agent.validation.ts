import { z } from "zod";

/**
 * Schema for AI-agent-collected leads (POST /api/agent/leads).
 *
 * Three required fields (name, email, summary) form the minimum-viable lead.
 * Everything else is optional and goes into the structured `metadata` JSON
 * column on ContactMessage, so brothers can later filter "leads with
 * urgency=immediate" or "leads with budget >£5k" without schema churn.
 *
 * If the agent doesn't recognize a category cleanly, it can simply omit it —
 * unlike the public form, this endpoint does NOT require a serviceId UUID.
 */
export const agentLeadSchema = z.object({
  name: z
    .string()
    .min(2, "name must be at least 2 characters")
    .max(200, "name too long"),

  email: z.email("invalid email format").max(254, "email too long"),

  // Required: the distilled conversation / what they need help with.
  summary: z
    .string()
    .min(10, "summary must be at least 10 characters")
    .max(5000, "summary too long"),

  // Optional contact channels.
  phone: z.string().max(50).optional(),
  whatsappNumber: z.string().max(50).optional(),

  // Free-text service intent the agent inferred (e.g. "VAT", "Payroll").
  // We do NOT enforce it matches a real Service row — that's a soft
  // categorization; admins can map it manually if useful.
  serviceCategory: z.string().max(100).optional(),

  businessName: z.string().max(200).optional(),
  businessType: z.string().max(100).optional(),

  urgency: z.enum(["immediate", "this_month", "exploring"]).optional(),

  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]).optional(),

  conversationRef: z.url("conversationRef must be a valid URL").optional(),

  agentConfidence: z.number().min(0).max(1).optional(),
}).passthrough();
// passthrough(): any extra fields the agent sends are preserved into
// metadata so we can introspect/iterate without schema churn.

export type AgentLeadInput = z.infer<typeof agentLeadSchema>;
