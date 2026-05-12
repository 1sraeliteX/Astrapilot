# AstraPilot — Build Plan

Autonomous AI commerce agent for cross-border trade, powered by Stellar + Trustless Work escrow. Demo-mode first (no login required), wallet/auth optional later.

## Scope (Hackathon MVP)

Frontend-first, polished enterprise SaaS UI with mocked data + real AI chat. Trustless Work integration via REST API on testnet. Stellar wallet connect optional.

## Brand

- Dark theme, deep black (#050505) bg, crimson/scarlet accents (#E11D48, #FF3B30), soft white text
- Inter font, large rounded cards (24px), subtle red glows, thin grid overlays
- Logo: use uploaded AstraPilot icon in `src/assets/`

## Pages & Routes (TanStack Start)

```
/                       Landing page (hero, features, demo preview, CTA)
/app                    Dashboard (KPIs, global trade map, pipeline, activity)
/app/agent              AI Trade Agent chat (Perplexity-style)
/app/new-deal           Multi-step wizard (trade → parties → milestones → docs → preview → deploy)
/app/escrows            Escrow list
/app/escrows/$id        Escrow details (timeline, parties, docs, dispute, viewer embed)
/app/suppliers          Suppliers list
/app/suppliers/$id      Supplier profile (verification, risk, history)
/app/documents          Document intelligence (upload + AI extraction)
/app/risk               Risk analysis (radar, fraud, country risk)
/app/analytics          Analytics (volume, success rates, geo)
/app/settings           Settings + wallet connection
/onboarding             Role select (Supplier vs Buyer) + wallet/social login
```

App shell: left sidebar nav, top command bar (search, notifications, wallet status, profile), main content, optional right insights panel.

## Key Components

- `AppSidebar`, `TopBar`, `CommandPalette`
- `KPICard`, `GlobalTradeMap` (SVG world + animated arcs), `EscrowPipelineChart`, `ActivityFeed`
- `AgentChat` (streaming markdown, structured cards for risk/milestones/docs)
- `MilestoneBuilder`, `MilestoneTimeline`, `EscrowPreviewCard`
- `SupplierRiskMeter`, `RiskRadar` (recharts)
- `DocumentUploader` + extracted-fields panel
- `WalletConnectButton` (Freighter / mock)

## AI Agent

- Backend: TanStack server route `src/routes/api/chat.ts` using Vercel AI SDK + Lovable AI Gateway (`google/gemini-3-flash-preview`)
- System prompt encodes AstraPilot persona + trade-finance + escrow knowledge
- Tools:
  - `assessSupplier({name, country})` → mocked risk score
  - `proposeMilestones({amount, commodity, origin, destination})` → structured plan
  - `listRequiredDocuments({tradeType})` → standard trade docs
  - `createEscrow({...})` → calls Trustless Work API (server-side), returns contract id + viewer URL
- Frontend: `useChat` from `@ai-sdk/react`, render `message.parts` with custom tool renderers (cards for milestones, risk meter, escrow created)

## Trustless Work Integration

- API key stored as `TRUSTLESS_WORK_API_KEY` secret
- Server-side helper `src/lib/trustless-work.server.ts`:
  - `createEscrow`, `getEscrow`, `approveMilestone`, `releaseFunds`, `raiseDispute`
  - Base URL: `https://dev.api.trustlesswork.com` (testnet)
- Embed Escrow Viewer (`https://viewer.trustlesswork.com/<id>`) via iframe on escrow detail page
- Demo mode: when no API key / not connected, fall back to local mock state so the full flow still works for judges

## Demo Mode (No Login)

- Global Zustand store seeded with realistic mock escrows, suppliers, activity
- AI agent works via Lovable AI Gateway out of the box
- "Create Escrow" in demo mode generates a fake contract id; with wallet connected + API key, it hits Trustless Work testnet

## Wallet & Auth (Phase 2 in this build)

- Onboarding screen: choose role (Supplier / Buyer), then Connect Wallet (Freighter) or Email/Google (Lovable Cloud auth — deferred until user enables Cloud)
- For now: wallet connect button is non-functional placeholder + role stored in local state. Real auth requires enabling Lovable Cloud.

## Tech

- TanStack Start, React 19, Tailwind v4 (tokens in `src/styles.css`)
- shadcn/ui components
- recharts for charts, framer-motion for micro-interactions
- AI SDK + `@ai-sdk/openai-compatible` → Lovable AI Gateway
- react-markdown for chat

## Build Order

1. Design system tokens (black + crimson palette) in `styles.css`, fonts, logo asset
2. Landing page (hero with animated trade-route map, features, demo preview, footer)
3. App shell (sidebar + topbar layout under `/app`)
4. Dashboard with KPIs + map + pipeline + activity (mock data)
5. AI Trade Agent chat + server route + Lovable AI Gateway + tool renderers
6. New Deal wizard + Milestone builder
7. Escrows list + detail page (timeline, viewer iframe)
8. Suppliers, Documents, Risk, Analytics pages
9. Settings + wallet connect placeholder + onboarding role select
10. Polish: animations, mobile responsive, empty states

## Open Questions

1. **Lovable Cloud**: currently disabled. Real auth (email/Google) and persistent escrow/user data need it enabled. OK to ship demo-mode-only for now and enable Cloud later?
2. **Trustless Work API key**: should I add it as a secret now, or run pure mock mode for the hackathon demo?
3. **Stellar wallet**: integrate Freighter SDK now, or ship a styled "Connect Wallet" placeholder?
4. **Scope for first pass**: build all 10 pages, or prioritize Landing + Dashboard + AI Agent + New Deal + Escrow Detail (the demo story) and stub the rest?
