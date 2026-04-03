import { NextResponse } from 'next/server';
import { Location } from '@/model/Location';
import { verifyToken } from '@/utils/jwt';

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Manage branch locations
 */

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations for current user
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               zipCode: { type: string }
 *               status: { type: string, enum: [active, inactive] }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */

async function validateToken(req: Request) {
  const accessToken = req.headers.get('cookie')?.split('; ').find(c => c.startsWith('access_token='))?.split('=')[1];
  if (!accessToken) return null;
  try {
    return await verifyToken(accessToken);
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const locations = await Location.findAll({ 
      where: { userId: payload.id },
      order: [['name', 'ASC']] 
    });
    return NextResponse.json({ locations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, code, address, city, zipCode, status } = body;

    const location = await Location.create({
      name,
      code,
      address,
      city,
      zipCode,
      status: status || 'active',
      userId: payload.id
    });

    return NextResponse.json({ location }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Location code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create location' }, { status: 500 });
  }
}
