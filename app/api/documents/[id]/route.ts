import { NextResponse } from 'next/server';
import { Document, IDocument } from '@/model/Document';
import { validateToken } from '@/common/apiAuth';

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document by ID (Owner only)
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       403:
 *         description: Forbidden (Not the owner)
 *       404:
 *         description: Document not found
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const documentId = Number((await params).id);
    const document = await Document.findByPk(documentId) as unknown as IDocument & { destroy: () => Promise<void> } | null;

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Authorization check: Only the owner can delete
    if (document.userId !== payload.id) {
      return NextResponse.json({ error: 'Forbidden: You are not the owner of this document' }, { status: 403 });
    }

    // Note: We're only deleting from database for now. 
    // In a production app, we would also delete from Cloudinary using some cloud utility.
    await document.destroy();

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    console.error('Document deletion error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete document' }, { status: 500 });
  }
}
