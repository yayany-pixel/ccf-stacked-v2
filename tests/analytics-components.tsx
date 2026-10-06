import React from "react";
import { renderToString } from "react-dom/server";
import assert from "node:assert/strict";
import GoogleAnalytics from "../components/GoogleAnalytics";
(globalThis as any).React = React;
const old = process.env.NEXT_PUBLIC_GA_ID_1;
const oldAds = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
delete process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
delete process.env.NEXT_PUBLIC_GA_ID_1;
assert.doesNotThrow(() => renderToString(<GoogleAnalytics />));
process.env.NEXT_PUBLIC_GA_ID_1 = "G-TESTONLY";
assert.doesNotThrow(() => renderToString(<GoogleAnalytics />));
assert.doesNotMatch(renderToString(<GoogleAnalytics />), /google-tag|googletagmanager/);
if (old) process.env.NEXT_PUBLIC_GA_ID_1 = old;
else delete process.env.NEXT_PUBLIC_GA_ID_1;
if (oldAds) process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = oldAds;
console.log(
  "Analytics component SSR safely handles present and absent IDs; browser test verifies script rendering.",
);
