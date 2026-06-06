import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { agentLeadSchema } from "./agent.validation.js";

/**
 * POST /api/agent/leads
 *
 * Creates a ContactMessage with:
 *   - source = AI_AGENT
 *   - status = PENDING_REVIEW  (brothers approve into NEW from admin UI)
 *   - message = body.summary
 *   - metadata = JSON containing everything else (whatsappNumber, budget,
 *     urgency, businessType, conversationRef, agentConfidence, +any extra
 *     pass-through fields the agent sent)
 *
 * Authenticated upstream by requireAgentApiKey middleware — by the time
 * we get here, the API key has been validated.
 */
export async function submitAgentLead(req: Request, res: Response): Promise<void> {
  const validation = agentLeadSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Validation failed",
      details: validation.error.issues.map((iss) => ({
        field: iss.path.join("."),
        message: iss.message,
      })),
    });
    return;
  }

  const {
    name,
    email,
    summary,
    phone,
    // The rest is captured into metadata so we don't lose any signal the agent
    // bothered to extract from the conversation.
    ...rest
  } = validation.data;

  // metadata = any structured extras the agent sent. JSON-serializable by
  // construction (Zod ensures it). null when there's nothing extra.
  const hasExtras = Object.keys(rest).length > 0;
  const metadata: Prisma.InputJsonValue | undefined = hasExtras
    ? (rest as Prisma.InputJsonObject)
    : undefined;

  try {
    const created = await prisma.contactMessage.create({
      data: {
        fullName: name,
        email,
        phone,
        message: summary,
        source: "AI_AGENT",
        status: "PENDING_REVIEW",
        ...(metadata !== undefined && { metadata }),
      },
      select: { id: true, status: true, createdAt: true },
    });

    res.status(201).json({
      id: created.id,
      status: created.status,
      createdAt: created.createdAt,
      message: "Lead recorded. Awaiting admin review.",
    });
  } catch (error) {
    console.error("[agent.controller] failed to record lead:", error);
    res.status(500).json({ error: "Failed to record lead" });
  }
}
