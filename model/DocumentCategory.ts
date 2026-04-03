import { DataTypes, Model } from 'sequelize';
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

export class DocumentCategory extends Model implements IDocumentCategory {
  public id!: number;
  public name!: string;
  public description!: string;
  public userId!: number;

  public readonly createdAt!: string;
  public readonly updatedAt!: string;
}

DocumentCategory.init(
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
    sequelize,
    tableName: 'document_categories',
  }
);
