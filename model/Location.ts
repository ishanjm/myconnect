import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';

export interface ILocation {
  id: number;
  name: string;
  code: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  status: 'active' | 'inactive';
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateLocationPayload {
  name: string;
  code: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  status?: 'active' | 'inactive';
  userId?: number;
}

export interface UpdateLocationPayload extends Partial<CreateLocationPayload> {
  id: number;
}

export class Location extends Model implements ILocation {
  public id!: number;
  public name!: string;
  public code!: string;
  public address!: string | null;
  public city!: string | null;
  public zipCode!: string | null;
  public status!: 'active' | 'inactive';
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // Allow true for migration of existing data
    },
  },
  {
    sequelize,
    tableName: 'locations',
  }
);
