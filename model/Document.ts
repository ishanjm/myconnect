import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db';

export interface IDocument {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  locationIds: number[];
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentFileType = string;

interface DocumentCreationAttributes extends Optional<IDocument, 'id' | 'locationIds' | 'createdAt' | 'updatedAt'> {}

const Document = sequelize.define<Model<IDocument, DocumentCreationAttributes>>(
  'Document',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    downloadUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationIds: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'documents',
  }
);

export default Document;
export { Document };
