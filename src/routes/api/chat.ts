import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM = `You are AstraPilot, an autonomous AI commerce agent for cross-border trade powered by Stellar (Soroban) and Trustless Work non-custodial escrow.

Your job:
- Parse trade intents in natural language (commodity, amount, origin, destination, parties).
- Assess supplier risk and recommend the strongest match.
- Design milestone-based escrow contracts denominated in stablecoins (USDC on Stellar).
- List required trade documents (PO, Commercial Invoice, Bill of Lading, QA Inspection, Certificate of Origin).
- Recommend release of funds when conditions are met. Recommend disputes when not.

Be concise, structured, and confident. Use markdown with headings, bullet lists, and short paragraphs.
When the user describes a deal, IMMEDIATELY call the tools: assessSupplier, then proposeMilestones, then listRequiredDocuments. After tool calls, summarize the recommendation and offer a "Create Escrow" next step.

Never mention you are a language model or which provider built you. You are AstraPilot.`;

const tools = {
  assessSupplier: tool({
    description: "Assess supplier risk for a counterparty in a given country.",
    inputSchema: z.object({
      supplierName: z.string(),
      country: z.string(),
      commodity: z.string().optional(),
    }),
    execute: async ({ supplierName, country, commodity }) => {
      // Deterministic mock scoring
      const seed = (supplierName + country).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const risk = (seed % 50) + 10;
      const match = 100 - risk + ((seed % 7) - 3);
      return {
        supplierName,
        country,
        commodity: commodity ?? null,
        riskScore: risk,
        matchScore: Math.max(40, Math.min(99, match)),
        verified: risk < 35,
        signals: [
          risk < 25 ? "Verified export history" : "Limited export history",
          risk < 30 ? "Active Soroban smart contract interactions" : "No prior on-chain activity",
          risk < 40 ? "No sanctions or compliance flags" : "Manual compliance review recommended",
        ],
      };
    },
  }),
  proposeMilestones: tool({
    description: "Propose a milestone-based escrow plan for a trade deal.",
    inputSchema: z.object({
      amountUSD: z.number(),
      commodity: z.string(),
      origin: z.string(),
      destination: z.string(),
    }),
    execute: async ({ amountUSD, commodity, origin, destination }) => {
      const milestones = [
        { name: "Initial Deposit", percent: 30, condition: "Escrow funded; production order issued" },
        { name: "Production / QA", percent: 30, condition: "Independent QA inspection report uploaded & verified" },
        { name: "Bill of Lading", percent: 30, condition: "BoL uploaded; cargo confirmed in transit" },
        { name: "Delivery Confirmation", percent: 10, condition: "Buyer signs off on delivery within 7 days" },
      ].map((m) => ({ ...m, amountUSD: Math.round((amountUSD * m.percent) / 100) }));
      return {
        commodity,
        origin,
        destination,
        currency: "USDC",
        network: "Stellar",
        arbiter: "Kleros",
        timeoutDays: 21,
        estimatedFeeXLM: 100,
        milestones,
      };
    },
  }),
  listRequiredDocuments: tool({
    description: "List the documents required for the proposed trade.",
    inputSchema: z.object({
      commodity: z.string(),
      crossBorder: z.boolean().default(true),
    }),
    execute: async ({ commodity, crossBorder }) => ({
      commodity,
      documents: [
        { name: "Commercial Invoice", criticality: "standard" },
        { name: "Purchase Order", criticality: "standard" },
        { name: "Bill of Lading (Ocean)", criticality: "critical" },
        { name: "Independent QA Inspection Report", criticality: "critical" },
        ...(crossBorder
          ? [
              { name: "Certificate of Origin", criticality: "standard" },
              { name: "Customs Declaration", criticality: "standard" },
            ]
          : []),
      ],
    }),
  }),
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("Messages are required", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM,
          tools,
          stopWhen: stepCountIs(50),
          messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
