import { DataTypes, Model } from 'sequelize';
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

export class Document extends Model implements IDocument {
  public id!: number;
  public title!: string;
  public description!: string;
  public categoryId!: number;
  public fileType!: string;
  public fileSize!: string;
  public downloadUrl!: string;
  public locationIds!: number[];
  public userId!: number;

  public readonly createdAt!: string;
  public readonly updatedAt!: string;
}

Document.init(
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
    sequelize,
    tableName: 'documents',
  }
);
