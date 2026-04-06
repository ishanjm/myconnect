import { NextResponse } from 'next/server';
import { DocumentCategory } from '@/model/DocumentCategory';
import { validateToken } from '@/common/apiAuth';

/**
 * @swagger
 * /api/document-categories/{id}:
 *   put:
 *     summary: Update an existing document category
 *     tags: [Document Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not Found
 */

/**
 * @swagger
 * /api/document-categories/{id}:
 *   delete:
 *     summary: Delete a document category
 *     tags: [Document Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not Found
 */



export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, description } = body;

    const category = await DocumentCategory.findOne({ 
      where: { id, userId: payload.id } 
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const category = await DocumentCategory.findOne({ 
      where: { id, userId: payload.id } 
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
