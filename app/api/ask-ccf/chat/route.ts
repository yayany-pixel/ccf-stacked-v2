/**
 * Ask CCF — chat endpoint.
 *
 * All AI calls and credentials stay here on the server. The browser sends the
 * visible conversation; this handler validates it, trims it, runs the tool
 * loop, and returns only text plus authoritative card data.
 */
import { NextResponse } from "next/server";
import { aiConfig, providerStatus, resolveProvider } from "@/lib/askccf/config";
import { buildSystemPrompt, extractClassTag, OPENING_MESSAGE, tidyReply } from "@/lib/askccf/prompt";
import { runTool, toolDefinitions, type InquiryDraft, type ToolContext } from "@/lib/askccf/tools";
import { toCardShape, requestedActivity, type CatalogClass, type CatalogLocation } from "@/lib/askccf/catalog";
import { correctScheduleWeekdays } from "@/lib/askccf/schedule";
import { clientIp, payloadError, readPayload } from "@/lib/askccf/security";
import {
  consumeRateLimit,
  databaseConfigured,
  databaseStatus,
  hashId,
  recordUsage,
  reserveDailyRequest,
} from "@/lib/askccf/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatRole = "user" | "assistant";

type IncomingMessage = { role: ChatRole; content: string };

type RawToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

type ApiMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: RawToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

const BOOKING_PORTAL = "https://colorcocktailfactory.as.me/";
const STAFF_EMAIL = "support@colorcocktailfactory.com";

const FALLBACK_TEXT = `I can't reach my studio data right now. You can browse everything and book at ${BOOKING_PORTAL} — or email ${STAFF_EMAIL} and the team will help.`;

const CONTROL_CHARS = /[\u0000-\u0008\u000b-\u001f\u007f]/g;

function normaliseCity(value: unknown): CatalogLocation | null {
  const raw = typeof value === "string" ? value.toLowerCase().trim() : "";
  if (raw === "chicago" || raw === "eugene" || raw === "online") return raw;
  return null;
}

/** Trims and removes control characters, but never rewrites the wording. */
function sanitise(text: string, max: number): string {
  return text.replace(CONTROL_CHARS, " ").trim().slice(0, max);
}

function parseHistory(value: unknown): IncomingMessage[] {
  if (!Array.isArray(value)) return [];
  const out: IncomingMessage[] = [];
  for (const item of value.slice(-(aiConfig.historyTurns * 2))) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const cleaned = sanitise(content, aiConfig.maxMessageChars);
    if (cleaned.length === 0) continue;
    if (cleaned === OPENING_MESSAGE) continue; // client-rendered greeting
    out.push({ role, content: cleaned });
  }
  return out;
}

function unavailable(reason: string, reply: string, status = 503) {
  return NextResponse.json({ state: "unavailable", reason, reply }, { status });
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await readPayload(request);
  } catch (error) {
    const { reason, status } = payloadError(error);
    return NextResponse.json({ state: "error", reason }, { status });
  }
  const rawMessage =
    typeof payload.message === "string" ? sanitise(payload.message, aiConfig.maxMessageChars) : "";
  if (rawMessage.length === 0) {
    return NextResponse.json({ state: "error", reason: "empty_message" }, { status: 400 });
  }

  const sessionId = typeof payload.sessionId === "string" ? payload.sessionId.slice(0, 64) : "";
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) {
    return NextResponse.json({ state: "error", reason: "invalid_session" }, { status: 400 });
  }

  const siteCity = normaliseCity(payload.city);
  const pagePath =
    typeof payload.pagePath === "string" && payload.pagePath.startsWith("/")
      ? payload.pagePath.replace(/[^\w\-/.]/g, "").slice(0, 120)
      : null;
  const history = parseHistory(payload.history);

  if (!aiConfig.enabled) {
    return unavailable(
      "disabled",
      `The assistant is switched off right now. Email ${STAFF_EMAIL} and the team will help.`,
    );
  }

  const provider = resolveProvider();
  if (!provider) {
    return unavailable("not_configured", FALLBACK_TEXT);
  }

  // --- Usage controls: durable wherever the database is available ---------
  const hour = new Date().toISOString().slice(0, 13);
  const [ipLimit, sessionLimit] = await Promise.all([
    consumeRateLimit(`ip:${hashId(clientIp(request))}:${hour}`, aiConfig.ratePerIpPerHour, 3_600_000),
    consumeRateLimit(`sess:${hashId(sessionId)}:${hour}`, aiConfig.ratePerSessionPerHour, 3_600_000),
  ]);
  if (!ipLimit.allowed || !sessionLimit.allowed) {
    return NextResponse.json(
      {
        state: "rate_limited",
        reply: `That's a lot of questions in one hour — I need a short break. You can keep browsing and booking at ${BOOKING_PORTAL}, or email ${STAFF_EMAIL}.`,
      },
      { status: 429 },
    );
  }

  const dailyReservation = await reserveDailyRequest(aiConfig.dailyRequestCap);
  if (dailyReservation === "unavailable") {
    return unavailable("usage_store_unavailable", FALLBACK_TEXT);
  }
  if (dailyReservation === "limited") {
    return unavailable(
      "daily_cap",
      `I've hit today's usage limit for the assistant. Everything is still bookable at ${BOOKING_PORTAL}, and ${STAFF_EMAIL} is always open.`,
    );
  }

  const ctx: ToolContext = { sessionId, siteCity, requiredActivity: requestedActivity(rawMessage), scheduleDates: [] };
  const messages: ApiMessage[] = [
    {
      role: "system",
      content: buildSystemPrompt({
        siteCity,
        pagePath,
      }),
    },
    ...history.map((message) => ({ role: message.role, content: message.content }) as ApiMessage),
    { role: "user", content: rawMessage },
  ];

  const turnDeadline = Date.now() + aiConfig.turnBudgetMs;
  const seenClasses = new Map<string, CatalogClass>();
  let draft: InquiryDraft | null = null;
  let promptTokens = 0;
  let completionTokens = 0;

  try {
    for (let round = 0; round <= aiConfig.maxToolRounds; round += 1) {
      const remaining = turnDeadline - Date.now();
      if (remaining <= 1_000) break;

      const completion = await callModel(
        provider,
        messages,
        remaining,
        round >= aiConfig.maxToolRounds,
      );
      promptTokens += completion.usage?.prompt_tokens ?? 0;
      completionTokens += completion.usage?.completion_tokens ?? 0;

      const choice = completion.choices?.[0];
      const toolCalls = choice?.message?.tool_calls ?? [];

      if (toolCalls.length > 0) {
        messages.push({
          role: "assistant",
          content: choice?.message?.content ?? null,
          tool_calls: toolCalls,
        });

        for (const call of toolCalls) {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(call.function?.arguments || "{}") as Record<string, unknown>;
          } catch {
            args = {};
          }
          const outcome = await runTool(call.function?.name ?? "", args, ctx);
          for (const found of outcome.classes ?? []) {
            const previous = seenClasses.get(found.id);
            seenClasses.set(found.id, {
              ...previous, ...found,
              nextStartISO: found.nextStartISO ?? previous?.nextStartISO,
              nextLocaleTime: found.nextLocaleTime ?? previous?.nextLocaleTime,
              matchingTimes: found.matchingTimes ?? previous?.matchingTimes,
            });
          }
          if (outcome.draft) draft = outcome.draft;
          messages.push({
            role: "tool",
            tool_call_id: call.id,
            // Tool results are data; the system prompt states that explicitly.
            content: JSON.stringify(outcome.result).slice(0, 12_000),
          });
        }
        continue;
      }

      const rawText = (choice?.message?.content ?? "").trim();
      if (rawText.length === 0) break;

      const { text: tagged, ids } = extractClassTag(rawText);
      const text = correctScheduleWeekdays(tidyReply(tagged), ctx.scheduleDates ?? []);
      // Cards render only from classes a tool actually returned this turn.
      const cards = ids
        .map((id) => seenClasses.get(id))
        .filter((found): found is CatalogClass => Boolean(found))
        .map(toCardShape);

      await recordUsage({
        model: aiConfig.model,
        promptTokens,
        completionTokens,
        viaGateway: provider.viaGateway,
      });

      return NextResponse.json({
        state: "ok",
        reply: text.length > 0 ? text : FALLBACK_TEXT,
        cards,
        draft,
        degraded:
          ipLimit.degraded || sessionLimit.degraded ? "rate_limit_memory_only" : undefined,
      });
    }

    // Out of tool rounds or out of time without a final message.
    await recordUsage({
      model: aiConfig.model,
      promptTokens,
      completionTokens,
      viaGateway: provider.viaGateway,
      failed: true,
    });
    return NextResponse.json({
      state: "timeout",
      reply: `That one is taking me longer than it should. Ask me again in a simpler way, or browse the full schedule at ${BOOKING_PORTAL}.`,
      cards: [],
      draft,
      retryable: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[AskCCF] chat failed:", message);
    await recordUsage({
      model: aiConfig.model,
      promptTokens,
      completionTokens,
      viaGateway: provider.viaGateway,
      failed: true,
    });
    const timedOut = /abort|timeout/i.test(message);
    return NextResponse.json(
      {
        state: timedOut ? "timeout" : "error",
        reply: timedOut
          ? `That took too long on my end. Ask me again and I'll have another go — or browse everything at ${BOOKING_PORTAL}.`
          : FALLBACK_TEXT,
        retryable: true,
      },
      { status: 503 },
    );
  }
}

type Completion = {
  choices?: Array<{ message?: { content?: string | null; tool_calls?: RawToolCall[] } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
};

async function callModel(
  provider: { endpoint: string; apiKey: string },
  messages: ApiMessage[],
  remainingMs: number,
  finalRound: boolean,
): Promise<Completion> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Math.max(1_000, Math.min(aiConfig.requestTimeoutMs, remainingMs)),
  );
  try {
    const response = await fetch(provider.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: aiConfig.model,
        max_completion_tokens: aiConfig.maxOutputTokens,
        messages,
        // On the last allowed round the model must answer in words, not tools.
        ...(finalRound ? {} : { tools: toolDefinitions, tool_choice: "auto" }),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`model_http_${response.status}: ${detail.slice(0, 200)}`);
    }
    return (await response.json()) as Completion;
  } finally {
    clearTimeout(timeout);
  }
}

/** Non-secret readiness check, useful when verifying a deploy. */
export async function GET() {
  return NextResponse.json({
    ...providerStatus(),
    knowledgeDatabase: databaseConfigured(),
    database: await databaseStatus(),
  });
}
