import { NextResponse } from 'next/server';
import { Document } from '@/model/Document';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { validateToken } from '@/common/apiAuth';

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Centralized repository for corporate assets and operational documentation
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Fetch all documents for the current user
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Create a new document entry with automated file upload
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, categoryId, file]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               categoryId: { type: integer }
 *               locationIds: { type: string, description: "JSON stringified array of numbers" }
 *               file: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 */

export async function GET(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const documents = await Document.findAll({ 
      where: { userId: payload.id },
      order: [['createdAt', 'DESC']] 
    });
    return NextResponse.json({ documents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = Number(formData.get('categoryId'));
    const locationIdsStr = formData.get('locationIds') as string;
    const locationIds = locationIdsStr ? JSON.parse(locationIdsStr) : [];
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const downloadUrl = await uploadToCloudinary(buffer, 'myconnect/documents', 'auto');

    // Auto-detect metadata
    const fileType = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    const fileSizeRaw = file.size;
    let fileSize = '';
    if (fileSizeRaw < 1024) fileSize = `${fileSizeRaw} B`;
    else if (fileSizeRaw < 1024 * 1024) fileSize = `${(fileSizeRaw / 1024).toFixed(1)} KB`;
    else fileSize = `${(fileSizeRaw / (1024 * 1024)).toFixed(1)} MB`;

    const document = await Document.create({
      title,
      description,
      categoryId,
      fileType: fileType as any,
      fileSize,
      downloadUrl,
      locationIds: locationIds || [],
      userId: payload.id
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error: any) {
    console.error('Document creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create document' }, { status: 500 });
  }
}
