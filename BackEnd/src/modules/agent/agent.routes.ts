import { Router } from "express";
import { submitAgentLead } from "./agent.controller.js";
import { requireAgentApiKey } from "./agent.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Agent
 *   description: Endpoints for AI-agent / external-integration platforms to submit leads
 */

/**
 * @swagger
 * /api/agent/leads:
 *   post:
 *     tags: [Agent]
 *     summary: Record a lead captured by an external AI agent (e.g. WhatsApp bot)
 *     description: |
 *       Authenticated via `X-API-Key` header. Stores the lead in ContactMessage
 *       with source=AI_AGENT and status=PENDING_REVIEW. Admins approve into NEW
 *       via the admin UI.
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, summary]
 *             properties:
 *               name:                   { type: string, minLength: 2 }
 *               email:                  { type: string, format: email }
 *               summary:                { type: string, minLength: 10 }
 *               phone:                  { type: string }
 *               whatsappNumber:         { type: string }
 *               serviceCategory:        { type: string }
 *               businessName:           { type: string }
 *               businessType:           { type: string }
 *               urgency:                { type: string, enum: [immediate, this_month, exploring] }
 *               preferredContactMethod: { type: string, enum: [email, phone, whatsapp] }
 *               conversationRef:        { type: string, format: uri }
 *               agentConfidence:        { type: number, minimum: 0, maximum: 1 }
 *     responses:
 *       201: { description: Lead recorded }
 *       400: { description: Validation failed }
 *       401: { description: Missing or invalid X-API-Key }
 *       500: { description: Server error }
 */
const router = Router();

router.use(requireAgentApiKey);
router.post("/leads", submitAgentLead);

export default router;
