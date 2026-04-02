import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|api|static).*)'],
};

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}
