import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import { User } from '@/model/User';

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user details
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: Request) {
  try {
    const accessToken = (req as any).cookies?.get('access_token')?.value || 
                        req.headers.get('cookie')?.split('; ').find(c => c.startsWith('access_token='))?.split('=')[1];

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token missing' }, { status: 401 });
    }

    const payload = await verifyToken(accessToken);
    const user = await User.findByPk(payload.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
