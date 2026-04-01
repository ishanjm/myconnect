import { NextResponse } from 'next/server';
import { Location } from '@/model/Location';
import { verifyToken } from '@/utils/jwt';
import { sequelize } from '@/utils/db';

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
    await sequelize.sync({ alter: true });
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
    await sequelize.sync({ alter: true });
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
