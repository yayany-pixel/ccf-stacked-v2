/**
 * Ask CCF — server-side configuration.
 *
 * Everything here is read from environment variables so the studio can retune
 * the assistant (model, caps, limits) without a code change. Nothing in this
 * file is imported by client components: credentials stay on the server.
 */

export type AiProvider = {
  /** Fully-qualified chat-completions endpoint. */
  endpoint: string;
  apiKey: string;
  /** Whether traffic is proxied through Netlify AI Gateway (billed to Netlify credits). */
  viaGateway: boolean;
};

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function num(name: string, fallback: number): number {
  const raw = env(name);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Default model: fast, inexpensive, supports the tool calls this assistant
 * needs. Override with CCF_AI_MODEL (must be a model AI Gateway supports).
 */
export const DEFAULT_MODEL = "gpt-5.4-mini";

export const aiConfig = {
  enabled: env("CCF_AI_ENABLED") !== "false",
  model: env("CCF_AI_MODEL") ?? DEFAULT_MODEL,
  maxOutputTokens: num("CCF_AI_MAX_TOKENS", 900),
  /** Wall-clock budget for a single model call. */
  requestTimeoutMs: num("CCF_AI_TIMEOUT_MS", 25_000),
  /** Wall-clock budget for one full turn including tool round-trips. */
  turnBudgetMs: num("CCF_AI_TURN_BUDGET_MS", 50_000),
  /** Tool-calling rounds allowed per turn. */
  maxToolRounds: num("CCF_AI_MAX_TOOL_ROUNDS", 4),
  /** Conversation turns kept when history is trimmed. */
  historyTurns: num("CCF_AI_HISTORY_TURNS", 12),
  maxMessageChars: num("CCF_AI_MAX_MESSAGE_CHARS", 1500),
  /** Usage controls. */
  ratePerIpPerHour: num("CCF_AI_RATE_PER_IP_HOUR", 40),
  ratePerSessionPerHour: num("CCF_AI_RATE_PER_SESSION_HOUR", 30),
  pickupLookupsPerHour: num("CCF_AI_PICKUP_LOOKUPS_PER_HOUR", 6),
  inquiriesPerDay: num("CCF_AI_INQUIRIES_PER_SESSION_DAY", 3),
  dailyRequestCap: num("CCF_AI_DAILY_REQUEST_CAP", 3000),
} as const;

/**
 * Resolve which OpenAI-compatible endpoint to use.
 *
 * Order of preference:
 *  1. An explicitly configured direct OpenAI key (Netlify never overwrites a
 *     key you set yourself, so this is the studio's deliberate choice).
 *  2. Netlify AI Gateway, which needs no key management at all.
 */
export function resolveProvider(): AiProvider | null {
  const override = env("CCF_AI_BASE_URL");
  const directKey = env("OPENAI_API_KEY");
  const gatewayKey = env("NETLIFY_AI_GATEWAY_KEY");
  const gatewayBase = env("NETLIFY_AI_GATEWAY_BASE_URL");

  if (directKey) {
    const base = override ?? env("OPENAI_BASE_URL") ?? "https://api.openai.com/v1";
    return {
      endpoint: joinUrl(base, "chat/completions"),
      apiKey: directKey,
      // A direct key set alongside a gateway base URL still bills through the gateway.
      viaGateway: Boolean(env("OPENAI_BASE_URL")?.includes("/.netlify/ai")),
    };
  }

  if (gatewayKey && (override ?? gatewayBase)) {
    const base = override ?? joinUrl(gatewayBase!, "v1");
    return {
      endpoint: joinUrl(base, "chat/completions"),
      apiKey: gatewayKey,
      viaGateway: true,
    };
  }

  return null;
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

/** Safe, non-secret description of the AI wiring, for health checks. */
export function providerStatus() {
  const provider = resolveProvider();
  return {
    configured: Boolean(provider),
    enabled: aiConfig.enabled,
    model: aiConfig.model,
    transport: provider ? (provider.viaGateway ? "netlify-ai-gateway" : "openai-direct") : "none",
  };
}
