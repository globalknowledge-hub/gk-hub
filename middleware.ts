import { NextRequest, NextResponse } from 'next/server';

// Minimal middleware: only redirect root '/' to default language.
// Keep this file intentionally small and free of any runtime calls.
const DEFAULT_LANG = 'en';

export const config = {
  matcher: ['/'],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname !== '/') return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANG}`;
  return NextResponse.redirect(url);
}
