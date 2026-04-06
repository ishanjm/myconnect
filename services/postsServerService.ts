import { Post, PostAttributes } from '@/model/Post';
import { User, UserAttributes } from '@/model/User';
import { deleteFromCloudinary, uploadToCloudinary } from '@/utils/cloudinary';
import { syncDB } from '@/utils/db';

export const serverPostsService = {
  getPosts: async () => {
    await syncDB();
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const postsWithAuthor = await Promise.all(posts.map(async (post: any) => {
      const user = await User.findByPk(post.userId) as unknown as UserAttributes | null;
      return {
        ...post.toJSON(),
        author: {
          id: user?.id,
          name: `${user?.firstName} ${user?.lastName}`,
          avatarUrl: user?.profileImage
        }
      };
    }));

    return postsWithAuthor;
  },

  createPost: async (content: string, file: File | null, userId: number) => {
    await syncDB();
    if (!content && !file) {
      const error: any = new Error('Post content or image is required');
      error.status = 400;
      throw error;
    }

    let imageUrl = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await uploadToCloudinary(buffer, 'myconnect/posts', 'image', [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]);
    }

    const post = await Post.create({
      content: content || '',
      imageUrl,
      userId
    });

    const user = await User.findByPk(userId) as unknown as UserAttributes | null;

    return {
      ...post.toJSON(),
      author: {
        id: user?.id,
        name: `${user?.firstName} ${user?.lastName}`,
        avatarUrl: user?.profileImage
      }
    };
  },

  deletePost: async (postId: number, userId: number): Promise<void> => {
    // 1. Database Retrieval & Types
    const post = await Post.findByPk(postId) as unknown as PostAttributes & { destroy: () => Promise<void> } | null;

    if (!post) {
      const error: any = new Error('Post not found');
      error.status = 404;
      throw error;
    }

    // 2. Ownership Authorization
    if (post.userId !== userId) {
      const error: any = new Error('Forbidden: You are not the owner of this shoutout');
      error.status = 403;
      throw error;
    }

    // 3. Image Deletion via Cloudinary
    if (post.imageUrl) {
      try {
        await deleteFromCloudinary(post.imageUrl);
      } catch (cloudError) {
        console.error('Failed to delete image from Cloudinary:', cloudError);
        // We log the error but proceed with deleting the post from the DB so it doesn't get orphaned.
      }
    }

    // 4. Database Deletion
    await post.destroy();
  }
};
