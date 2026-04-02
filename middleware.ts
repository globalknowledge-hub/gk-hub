import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// Explicitly set empty matcher to disable middleware
export const config = {
  matcher: [],
};
