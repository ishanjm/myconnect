import axios from 'axios';
import { Post } from '@/model/Post';

export const postsService = {
  getPosts: async (): Promise<Post[]> => {
    const response = await axios.get('/api/posts');
    return response.data.posts;
  },

  createPost: async (content: string, file: File | null): Promise<Post> => {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);

    const response = await axios.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.post;
  },
};
