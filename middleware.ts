import { NextRequest, NextResponse } from 'next/server';

// NOTE: avoid importing project root JSON in Edge middleware (Turbopack/build can fail).
// Use constants here; keep in sync with `hub-master-config.json` if needed.
const toggles: string[] = ['as', 'hi', 'bn', 'en'];
const defaultLang: string = 'en';

// Apply middleware to root and any non-api/_next paths
export const config = {
  matcher: ['/', '/((?!api|_next|static|public|.*\\..*).*)'],
};

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Skip if path already starts with a known locale
  const first = pathname.split('/')[1];
  if (toggles.includes(first)) return NextResponse.next();

  // Skip assets and API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('/static/')) {
    return NextResponse.next();
  }

  // Determine preferred locale: cookie > accept-language > default
  let preferred = defaultLang;
  try {
    const cookie = req.cookies.get('readerLang') ?? req.cookies.get('NEXT_LOCALE');
    if (cookie && cookie.value && toggles.includes(cookie.value)) preferred = cookie.value;
    else {
      const al = req.headers.get('accept-language') || '';
      // crude detection: prefer Assamese if Accept-Language contains 'as' or 'assam'
      if (/\bas\b/i.test(al) || /assam/i.test(al) || /অসমী/i.test(al)) preferred = 'as';
    }
  } catch (e) {
    // ignore and use default
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}
