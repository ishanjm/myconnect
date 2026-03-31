export interface PostAuthor {
  id: number;
  name: string;
  avatarUrl?: string;
  subscription?: string;
}

export interface PostReaction {
  likes: number;
  comments: number;
  shares: number;
}

export interface Post {
  id: number;
  author: PostAuthor;
  content: string;
  imageUrl?: string;
  createdAt: string;
  reactions: PostReaction;
  tags?: string[];
}
