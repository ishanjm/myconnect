import { NextResponse } from 'next/server';
import { signAccessToken, verifyToken } from '@/utils/jwt';

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully refreshed access token
 *       401:
 *         description: Invalid or expired refresh token
 */
export async function POST(req: Request) {
  try {
    const refreshToken = (req as any).cookies?.get('refresh_token')?.value || 
                         req.headers.get('cookie')?.split('; ').find(c => c.startsWith('refresh_token='))?.split('=')[1];

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    const payload = await verifyToken(refreshToken);
    
    // Issue a new access token
    const accessToken = await signAccessToken({ 
      id: payload.id, 
      email: payload.email, 
      name: payload.name, 
      role: payload.role 
    });

    const response = NextResponse.json({
      token: accessToken,
      user: { id: payload.id, email: payload.email, name: payload.name, role: payload.role }
    });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
