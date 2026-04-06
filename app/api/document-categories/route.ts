import { NextResponse } from 'next/server';
import { DocumentCategory } from '@/model/DocumentCategory';
import { validateToken } from '@/common/apiAuth';

/**
 * @swagger
 * tags:
 *   name: Document Categories
 *   description: Dynamic categorization for company documents
 */

/**
 * @swagger
 * /api/document-categories:
 *   get:
 *     summary: Fetch all document categories for the current user
 *     tags: [Document Categories]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/document-categories:
 *   post:
 *     summary: Create a new document category
 *     tags: [Document Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "HR" }
 *               description: { type: string, example: "Human Resources policies" }
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */



export async function GET(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Ensure the table exists
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
