import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user by clearing authentication cookies
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });

  // Clear authentication cookies
  response.cookies.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    maxAge: 0,
    path: '/',
  });

  return response;
}
