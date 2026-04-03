import { NextResponse } from 'next/server';
import { DocumentCategory } from '@/model/DocumentCategory';
import { verifyToken } from '@/utils/jwt';

async function validateToken(req: Request) {
  const accessToken = req.headers.get('cookie')?.split('; ').find(c => c.startsWith('access_token='))?.split('=')[1];
  if (!accessToken) return null;
  try {
    return await verifyToken(accessToken);
  } catch {
    return null;
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, description } = body;

    const category = await DocumentCategory.findOne({ 
      where: { id: params.id, userId: payload.id } 
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    
    await category.save();
    return NextResponse.json({ category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const category = await DocumentCategory.findOne({ 
      where: { id: params.id, userId: payload.id } 
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await category.destroy();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
