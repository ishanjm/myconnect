import { NextResponse } from 'next/server';
import { User } from '@/model/User';
import { sequelize } from '@/utils/db';
import { signAccessToken, signRefreshToken } from '@/utils/jwt';
import { hashPassword } from '@/utils/password';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    
    // Auto-create tables if they don't exist yet
    await sequelize.sync();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Determine role based on existing user count
    const userCount = await User.count();
    const role = userCount === 0 ? 'super admin' : 'member';

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ email, password: hashedPassword, name, role });
    const accessToken = await signAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const refreshToken = await signRefreshToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    const response = NextResponse.json({
      token: accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
