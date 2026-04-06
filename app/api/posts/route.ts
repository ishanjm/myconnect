import { NextResponse } from 'next/server';
import { validateToken } from '@/common/apiAuth';
import { serverPostsService } from '@/services/postsServerService';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Fetch all posts for the social feed
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch
 */
export async function GET(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const postsWithAuthor = await serverPostsService.getPosts();
    return NextResponse.json({ posts: postsWithAuthor });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || 'Failed to fetch posts' }, { status });
  }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new shoutout/post with optional image
 *     tags: [Posts]
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create
 */
export async function POST(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;

    const newPost = await serverPostsService.createPost(content, file, payload.id);

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Post creation error:', error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || 'Failed to create post' }, { status });
  }
}
