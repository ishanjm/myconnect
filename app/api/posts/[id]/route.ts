import { NextResponse } from 'next/server';
import { serverPostsService } from '@/services/postsServerService';
import { validateToken } from '@/common/apiAuth';

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a shoutout by ID (Owner only)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const resolvedParams = await params;
    const postId = Number(resolvedParams.id);

    await serverPostsService.deletePost(postId, payload.id);

    return NextResponse.json({ message: 'Shoutout deleted successfully' });
  } catch (error: any) {
    console.error('Post deletion error:', error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || 'Failed to delete shoutout' }, { status });
  }
}
