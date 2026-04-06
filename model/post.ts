import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db';

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

export interface PostAttributes {
  id: number;
  content: string;
  imageUrl?: string | null;
  userId: number;
  tags?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Computed or associated properties (not in DB table directly usually, or handled as associations)
  author?: PostAuthor;
  reactions?: PostReaction;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'imageUrl' | 'tags' | 'createdAt' | 'updatedAt' | 'author' | 'reactions'> {}

const Post = sequelize.define<Model<PostAttributes, PostCreationAttributes>>(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: 'posts',
  }
);

export default Post;
export { Post };
