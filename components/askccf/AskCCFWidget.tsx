"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import ClassCards from "./ClassCards";
import InquiryCard from "./InquiryCard";
import ReplyText from "./ReplyText";
import type { ChatMessage, ChatResponse, InquiryResponse } from "./types";

/** Must match OPENING_MESSAGE in lib/askccf/prompt.ts: the server filters this
 *  client-rendered greeting out of the history it sends to the model. */
const OPENING_MESSAGE = "Hi there! What can I help you with today?";

const SUGGESTIONS = [
  { label: "Find my class", message: "I'm looking for a class." },
  { label: "Plan a date night", message: "What do you have for date night?" },
  { label: "Book a party", message: "I'd like to plan a private party." },
  { label: "Pick up my pottery", message: "Is my pottery ready to pick up?" },
  { label: "Something else", message: "I have a question about your studio." },
];

const STAFF_EMAIL = "support@colorcocktailfactory.com";

const SESSION_KEY = "ask-ccf:session";
const MESSAGES_KEY = "ask-ccf:messages";
const OPEN_KEY = "ask-ccf:open";
const MAX_STORED = 40;
const MAX_CHARS = 1500;

/** Routes where the customer assistant should not appear. */
const HIDDEN_PREFIXES = ["/teach", "/analytics"];

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `s${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function messageId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function readStoredMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ChatMessage =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as ChatMessage).text === "string" &&
        ((item as ChatMessage).role === "user" || (item as ChatMessage).role === "assistant"),
    );
  } catch {
    return [];
  }
}

/** City the site is currently showing: URL first, then the saved preference. */
function detectCity(pathname: string): "chicago" | "eugene" | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment === "chicago" || segment === "eugene") return segment;
  try {
    const stored = localStorage.getItem("preferredCity") ?? localStorage.getItem("ccf-city");
    if (stored === "chicago" || stored === "eugene") return stored;
  } catch {
    /* storage blocked — fall through and let the assistant ask */
  }
  return null;
}

export default function AskCCFWidget() {
  const pathname = usePathname() ?? "/";
  const hidden = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<string>("");
  const [sessionId, setSessionId] = React.useState("");
  const [mobileViewport, setMobileViewport] = React.useState<{ height: number; bottom: number } | null>(null);

  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const logEndRef = React.useRef<HTMLDivElement>(null);
  const lastUserMessage = React.useRef<string>("");
  const generationRef = React.useRef(0);
  const pendingRef = React.useRef(new Set<AbortController>());

  React.useEffect(() => () => {
    generationRef.current += 1;
    pendingRef.current.forEach((controller) => controller.abort());
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    const update = () => {
      setMobileViewport(window.innerWidth < 640 && viewport ? {
        height: Math.round(viewport.height * 0.85),
        bottom: Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop),
      } : null);
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // Restore the session-long conversation (survives navigation, not new tabs).
  React.useEffect(() => {
    try {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
        id = newSessionId();
        sessionStorage.setItem(SESSION_KEY, id);
      }
      setSessionId(id);
      setMessages(readStoredMessages());
      setOpen(sessionStorage.getItem(OPEN_KEY) === "1");
    } catch {
      setSessionId(newSessionId());
    }
  }, []);

  React.useEffect(() => {
    if (messages.length === 0) return;
    try {
      sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch {
      /* storage full or blocked: the conversation simply won't persist */
    }
  }, [messages]);

  React.useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending, open]);

  // Escape closes the panel, matching dialog conventions.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closePanel();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function persistOpen(next: boolean) {
    try {
      sessionStorage.setItem(OPEN_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function openPanel() {
    setOpen(true);
    persistOpen(true);
    trackEvent("ask_ccf_open", { page_path: pathname });
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  function closePanel() {
    setOpen(false);
    persistOpen(false);
    launcherRef.current?.focus();
  }

  function startNewConversation() {
    generationRef.current += 1;
    pendingRef.current.forEach((controller) => controller.abort());
    pendingRef.current.clear();
    setSending(false);
    setInput("");
    const id = newSessionId();
    lastUserMessage.current = "";
    setMessages([]);
    setStatus("Started a new conversation.");
    setSessionId(id);
    try {
      sessionStorage.setItem(SESSION_KEY, id);
      sessionStorage.removeItem(MESSAGES_KEY);
    } catch {
      /* ignore */
    }
    trackEvent("ask_ccf_new_conversation", { page_path: pathname });
    inputRef.current?.focus();
  }

  /** Last thing the customer typed, for retry after a page reload. */
  function lastCustomerMessage(): string {
    return [...messages].reverse().find((message) => message.role === "user")?.text ?? "";
  }

  async function send(text: string) {
    const trimmed = text.trim().slice(0, MAX_CHARS);
    if (trimmed.length === 0 || sending) return;

    lastUserMessage.current = trimmed;
    const outgoing: ChatMessage = { id: messageId(), role: "user", text: trimmed };
    const history = messages
      .filter((message) => !message.failed)
      .slice(-24)
      .map((message) => ({ role: message.role, content: message.text }));

    setMessages((current) => [...current.filter((m) => !m.failed), outgoing]);
    setInput("");
    setSending(true);
    setStatus("Thinking…");
    const generation = generationRef.current;
    const controller = new AbortController();
    pendingRef.current.add(controller);
    const timeout = window.setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch("/api/ask-ccf/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId,
          message: trimmed,
          history,
          city: detectCity(pathname),
          pagePath: pathname,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ChatResponse;
      if (generation !== generationRef.current) return;
      const reply =
        data.reply ??
        "Something went wrong on my end. Try again, or email support@colorcocktailfactory.com.";

      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          text: reply,
          cards: data.cards ?? [],
          draft: data.draft ?? null,
          draftState: data.draft ? "pending" : undefined,
          failed: data.state !== "ok",
        },
      ]);
      setStatus(data.state === "ok" ? "Reply received." : "The assistant is unavailable.");
    } catch {
      if (generation !== generationRef.current) return;
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          text: "I couldn't reach the studio just now. Check your connection and try again — or email support@colorcocktailfactory.com.",
          failed: true,
        },
      ]);
      setStatus("Connection problem.");
    } finally {
      window.clearTimeout(timeout);
      pendingRef.current.delete(controller);
      if (generation === generationRef.current) setSending(false);
    }
  }

  async function submitInquiry(target: ChatMessage) {
    if (!target.draft || target.draftState === "sending" || target.draftState === "sent") return;

    const update = (patch: Partial<ChatMessage>) =>
      setMessages((current) =>
        current.map((message) => (message.id === target.id ? { ...message, ...patch } : message)),
      );

    update({ draftState: "sending" });
    const generation = generationRef.current;
    const controller = new AbortController();
    pendingRef.current.add(controller);
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch("/api/ask-ccf/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ sessionId, ...target.draft, website: "" }),
      });
      const data = (await response.json().catch(() => ({}))) as InquiryResponse;
      if (generation !== generationRef.current) return;

      if (data.status === "received" || data.status === "duplicate") {
        update({
          draftState: data.status === "received" ? "sent" : "duplicate",
          draftMessage: data.message,
        });
        setStatus(data.message ?? "Inquiry sent.");
        // Conversion signal only — no names, emails or message text.
        trackEvent("ask_ccf_inquiry_submit", {
          page_path: pathname,
          city: target.draft.city,
          duplicate: data.status === "duplicate",
        });
        if (data.status === "received") {
          trackEvent("generate_lead", { event_category: "private_party_inquiry" });
        }
      } else {
        update({
          draftState: "failed",
          draftMessage:
            data.message ??
            "That didn't go through. Try again, or email support@colorcocktailfactory.com.",
        });
        setStatus("The inquiry didn't send.");
      }
    } catch {
      if (generation !== generationRef.current) return;
      update({
        draftState: "failed",
        draftMessage:
          "That didn't go through — check your connection and try again, or email support@colorcocktailfactory.com.",
      });
      setStatus("The inquiry didn't send.");
    } finally {
      window.clearTimeout(timeout);
      pendingRef.current.delete(controller);
    }
  }

  if (hidden) return null;

  const showSuggestions = messages.length === 0;

  return (
    <>
      {/* Launcher sits bottom-left so the booking CTAs bottom-right stay clear. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-controls="ask-ccf-panel"
        aria-label={open ? "Close studio help" : "Open studio help, the CCF AI assistant"}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/15 bg-gradient-to-br from-purple-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
      >
        <span aria-hidden="true">💬</span>
        <span>{open ? "Close" : "Need a hand?"}</span>
      </button>

      {open ? (
        <div
          id="ask-ccf-panel"
          role="dialog"
          aria-label="Studio help — CCF AI assistant"
          style={mobileViewport ?? undefined}
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col supports-[height:1dvh]:h-[85dvh] rounded-t-3xl border border-white/10 bg-[#12101f]/95 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-24 sm:left-6 sm:h-[32rem] sm:max-h-[calc(100dvh-7rem)] sm:w-[24rem] sm:rounded-3xl"
        >
          <header className="flex items-start justify-between gap-2 border-b border-white/10 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Studio help</h2>
              <p className="text-xs font-normal text-white/50">AI-powered help from CCF</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startNewConversation}
                className="min-h-11 rounded-full border border-white/15 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Start over
              </button>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close studio help"
                className="min-h-11 min-w-11 rounded-full border border-white/15 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                ✕
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            <div className="rounded-2xl bg-white/5 p-3 text-sm text-white/85">{OPENING_MESSAGE}</div>

            {showSuggestions ? (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Suggested actions">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion.label}>
                    <button
                      type="button"
                      onClick={() => send(suggestion.message)}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {suggestion.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <ol className="mt-3 space-y-3" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" aria-atomic="false">
              {messages.map((message) => (
                <li key={message.id}>
                  <div
                    className={
                      message.role === "user"
                        ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-purple-500/25 px-3 py-2 text-sm text-white"
                        : "w-fit max-w-[95%] rounded-2xl bg-white/5 px-3 py-2 text-sm text-white/85"
                    }
                  >
                    <span className="sr-only">
                      {message.role === "user" ? "You said: " : "Assistant said: "}
                    </span>
                    {message.role === "assistant" ? <ReplyText text={message.text} /> : <span className="whitespace-pre-wrap break-words">{message.text}</span>}
                  </div>

                  {message.cards && message.cards.length > 0 ? (
                    <ClassCards cards={message.cards} />
                  ) : null}

                  {message.draft ? (
                    <InquiryCard
                      draft={message.draft}
                      state={message.draftState ?? "pending"}
                      message={message.draftMessage}
                      onSubmit={() => submitInquiry(message)}
                    />
                  ) : null}

                  {/* Staff contact surfaces only where it helps: a reply we
                      could not deliver, or an inquiry that did not send. */}
                  {message.role === "assistant" &&
                  (message.failed || message.draftState === "failed") ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {message.failed ? (
                        <button
                          type="button"
                          onClick={() => send(lastUserMessage.current || lastCustomerMessage())}
                          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          Try again
                        </button>
                      ) : null}
                      <a
                        href={`mailto:${STAFF_EMAIL}`}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 underline-offset-2 transition hover:bg-white/15 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Email the studio
                      </a>
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>

            {sending ? (
              <p className="mt-3 text-xs text-white/50">Checking with the studio…</p>
            ) : null}
            <div ref={logEndRef} />
          </div>

          {/* Screen-reader status channel: short, no conversation content. */}
          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>

          <form
            className="shrink-0 border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="ask-ccf-input" className="sr-only">
              Type your question
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id="ask-ccf-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_CHARS}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Type your question…"
                className="max-h-24 min-h-11 min-w-0 flex-1 resize-none rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-base text-white placeholder:text-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              />
              <button
                type="submit"
                disabled={!sessionId || sending || input.trim().length === 0}
                className="min-h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/70">AI processes this chat. Avoid payment or sensitive details. <a className="underline" href={`mailto:${STAFF_EMAIL}`}>Email the studio</a></p>
          </form>
        </div>
      ) : null}
    </>
  );
}
