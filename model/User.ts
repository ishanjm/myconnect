import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db';
import { UserRole } from './auth';
import { SubscriptionType, SUBSCRIPTION_VALUES } from '@/common/auth.constants';

export interface UserAttributes {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  subscription: SubscriptionType;
  address: string | null;
  mobileNumber: string | null;
  profileImage: string | null;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'password' | 'address' | 'mobileNumber' | 'profileImage' | 'name' | 'role' | 'createdAt' | 'updatedAt'> {}

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscription: {
      type: DataTypes.ENUM(...SUBSCRIPTION_VALUES),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('super admin', 'group admin', 'member'),
      allowNull: false,
      defaultValue: 'member',
    },
  },
  {
    tableName: 'users',
  }
);

export default User;
export { User };
