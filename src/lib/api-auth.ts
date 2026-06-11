import { NextRequest, NextResponse } from 'next/server';

const API_SECRET = process.env.API_SECRET || process.env.NEXTAUTH_SECRET;

/**
 * Verify a Bearer token from the Authorization header.
 * For the static-export demo build the token is the base64-encoded gati_auth
 * JSON written by the login page. In a production deployment replace this
 * with proper JWT verification (e.g. jose or next-auth getServerSession).
 */
export function requireAuth(request: NextRequest): { userId: string; role: string } | NextResponse {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized — missing Bearer token' },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.slice(7);
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (!payload?.email || !payload?.role) throw new Error('invalid payload');
    return { userId: payload.email, role: payload.role };
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unauthorized — invalid token' },
      { status: 401 }
    );
  }
}

export function isAuthError(val: unknown): val is NextResponse {
  return val instanceof NextResponse;
}
