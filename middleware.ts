import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|api|static|.*\\..*).*)'],
};

export function middleware(req: NextRequest) {
  // Temporarily disabled to debug routing issues
  return NextResponse.next();
}
