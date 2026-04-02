import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// Only run middleware on specific routes, excluding all static content
export const config = {
  matcher: ['/((?!.*\\..*|_next|api|static).*)', '/$'],
};
