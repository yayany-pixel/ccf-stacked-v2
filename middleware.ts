import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if experiment is enabled or disabled globally. The prompt says: "Provide a simple configuration to enable/disable the experiment and select the winning theme globally. Use earthy as the fallback."
  // For now, it's enabled.
  const EXPERIMENT_ENABLED = true;
  const WINNING_THEME = 'earthy'; // earthy or cyberpunk

  let theme = request.cookies.get('theme')?.value;
  let hasCookie = !!theme;

  // QA Overrides
  const urlTheme = request.nextUrl.searchParams.get('theme');
  if (urlTheme === 'earthy' || urlTheme === 'cyberpunk') {
    theme = urlTheme;
    hasCookie = false; // Force setting cookie
  }

  if (!theme || (theme !== 'earthy' && theme !== 'cyberpunk')) {
    if (EXPERIMENT_ENABLED) {
      // 50/50 split
      theme = Math.random() < 0.5 ? 'earthy' : 'cyberpunk';
    } else {
      theme = WINNING_THEME;
    }
    hasCookie = false;
  }

  const response = NextResponse.next();
  if (!hasCookie) {
    response.cookies.set('theme', theme, { maxAge: 90 * 24 * 60 * 60, path: '/' });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|images/|videos/|cursors/).*)',
  ],
};