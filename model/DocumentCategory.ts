import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db';

export interface IDocumentCategory {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDocumentCategoryPayload {
  name: string;
  description?: string;
}

interface DocumentCategoryCreationAttributes extends Optional<IDocumentCategory, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

const DocumentCategory = sequelize.define<Model<IDocumentCategory, DocumentCategoryCreationAttributes>>(
  'DocumentCategory',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'document_categories',
  }
);

export default DocumentCategory;
export { DocumentCategory };
