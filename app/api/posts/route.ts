import { NextResponse } from 'next/server';
import { Post } from '@/model/Post';
import { User } from '@/model/User';
import { validateToken } from '@/common/apiAuth';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { syncDB } from '@/utils/db';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Fetch all posts for the social feed
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await syncDB();
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    // Manually attach user info for now or use associations if defined
    const postsWithAuthor = await Promise.all(posts.map(async (post: any) => {
      const user = await User.findByPk(post.userId);
      return {
        ...post.toJSON(),
        author: {
          id: user?.id,
          name: `${user?.firstName} ${user?.lastName}`,
          avatarUrl: user?.profileImage
        }
      };
    }));

    return NextResponse.json({ posts: postsWithAuthor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch posts' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new shoutout/post with optional image
 *     tags: [Posts]
 */
export async function POST(req: Request) {
  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await syncDB();
    const formData = await req.formData();
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;

    if (!content && !file) {
      return NextResponse.json({ error: 'Post content or image is required' }, { status: 400 });
    }

    let imageUrl = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await uploadToCloudinary(buffer, 'myconnect/posts', 'image');
    }

    const post = await Post.create({
      content: content || '',
      imageUrl,
      userId: payload.id
    });

    const user = await User.findByPk(payload.id);

    return NextResponse.json({ 
      post: {
        ...post.toJSON(),
        author: {
          id: user?.id,
          name: `${user?.firstName} ${user?.lastName}`,
          avatarUrl: user?.profileImage
        }
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Post creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create post' }, { status: 500 });
  }
}
