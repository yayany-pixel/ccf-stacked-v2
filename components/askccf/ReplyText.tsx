import * as React from "react";

/** Render a small, safe subset of reply formatting without interpreting HTML. */
export default function ReplyText({ text }: { text: string }) {
  const tokens = text.split(/(https:\/\/[^\s<>]+|support@colorcocktailfactory\.com|\*\*[^*\n]+\*\*)/g);
  return <span className="whitespace-pre-wrap break-words">{tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={index}>{token.slice(2, -2)}</strong>;
    if (token === "support@colorcocktailfactory.com") return <a key={index} className="underline" href={`mailto:${token}`}>{token}</a>;
    if (token.startsWith("https://")) {
      const clean = token.replace(/[.,;:!?\])]+$/, "");
      try {
        const url = new URL(clean);
        const host = url.hostname;
        if (host === "colorcocktailfactory.com" || host === "colorcocktailfactory.as.me" || host.endsWith(".acuityscheduling.com")) {
          return <React.Fragment key={index}><a className="underline" href={url.href} target="_blank" rel="noopener noreferrer">{clean}</a>{token.slice(clean.length)}</React.Fragment>;
        }
      } catch { /* Untrusted URLs remain plain text. */ }
    }
    return <React.Fragment key={index}>{token}</React.Fragment>;
  })}</span>;
}
