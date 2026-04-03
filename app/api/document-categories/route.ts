import { NextResponse } from 'next/server';
import { DocumentCategory } from '@/model/DocumentCategory';
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
    // Ensure the table exists
    await sequelize.sync({ alter: true });
    const categories = await DocumentCategory.findAll({ 
      where: { userId: payload.id },
      order: [['name', 'ASC']] 
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await sequelize.sync({ alter: true });
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const category = await DocumentCategory.create({
      name,
      description,
      userId: payload.id
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}
