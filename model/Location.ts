import { DataTypes, Model, Optional } from 'sequelize';
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

interface LocationCreationAttributes extends Optional<ILocation, 'id' | 'address' | 'city' | 'zipCode' | 'status' | 'userId' | 'createdAt' | 'updatedAt'> {}

const Location = sequelize.define<Model<ILocation, LocationCreationAttributes>>(
  'Location',
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
    tableName: 'locations',
  }
);

export default Location;
export { Location };
