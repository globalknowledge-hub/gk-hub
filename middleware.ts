import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|api|static|.*\\..*).*)'],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Only redirect the root path
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }
  
  return NextResponse.next();
}
