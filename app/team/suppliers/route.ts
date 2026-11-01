import { randomBytes } from 'node:crypto';
import { supplierAccessAllowed, supplierCsv, supplierHtml, supplierJson } from '@/lib/supplier-library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request): Promise<Response> {
  const headers = new Headers({
    'Cache-Control': 'private, no-store, max-age=0',
    'CDN-Cache-Control': 'no-store',
    'Netlify-CDN-Cache-Control': 'no-store',
    'Vary': 'Authorization',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
  });
  // The route itself checks every HTML and download request; no middleware-only gate.
  const passwordHash = process.env.CCF_SUPPLIER_PASSWORD_SHA256;
  if (!passwordHash || !/^[a-f0-9]{64}$/.test(passwordHash)) {
    return new Response('Team reference is not configured yet.', { status: 503, headers });
  }
  if (!supplierAccessAllowed(request.headers.get('authorization'), passwordHash)) {
    headers.set('WWW-Authenticate', 'Basic realm="CCF Team Resources", charset="UTF-8"');
    return new Response('Sign in with the CCF team resource credentials.', { status: 401, headers });
  }
  try {
  const format = new URL(request.url).searchParams.get('format');
  if (format === 'csv' || format === 'json') {
    headers.set('Content-Type', format === 'csv' ? 'text/csv; charset=utf-8' : 'application/json; charset=utf-8');
    headers.set('Content-Disposition', `attachment; filename="ccf-supplier-directory.${format}"`);
    return new Response(format === 'csv' ? supplierCsv() : supplierJson(), { headers });
  }
  const nonce = randomBytes(18).toString('base64');
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
  return new Response(supplierHtml(nonce), { headers });
  } catch {
    headers.delete('Content-Disposition');
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    return new Response('Team reference is temporarily unavailable.', { status: 503, headers });
  }
}
