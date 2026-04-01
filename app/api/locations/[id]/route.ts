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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await sequelize.sync({ alter: true });
    const location = await Location.findOne({ 
      where: { id, userId: payload.id } 
    });
    if (!location) {
      return NextResponse.json({ error: 'Location not found or access denied' }, { status: 404 });
    }
    return NextResponse.json({ location });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch location' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await sequelize.sync({ alter: true });
    const location = await Location.findOne({ 
      where: { id, userId: payload.id } 
    });
    if (!location) {
      return NextResponse.json({ error: 'Location not found or access denied' }, { status: 404 });
    }

    const body = await req.json();
    await location.update(body);

    return NextResponse.json({ location });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Location code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await sequelize.sync({ alter: true });
    const location = await Location.findOne({ 
      where: { id, userId: payload.id } 
    });
    if (!location) {
      return NextResponse.json({ error: 'Location not found or access denied' }, { status: 404 });
    }
    await location.destroy();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete location' }, { status: 500 });
  }
}
