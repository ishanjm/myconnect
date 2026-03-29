import { NextResponse } from 'next/server';
import { User } from '@/model/User';
import { sequelize } from '@/utils/db';

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

    const user = await User.create({ email, password, name });

    return NextResponse.json({
      token: "mock-jwt-token-for-" + user.id,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
