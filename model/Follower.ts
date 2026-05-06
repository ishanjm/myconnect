import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface FollowerAttributes {
  id: number;
  /** The user being followed (quiz creator) */
  userId: number;
  /** The user doing the following (student who enrolled) */
  followerId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type FollowerCreationAttributes = Optional<
  FollowerAttributes,
  "id" | "createdAt" | "updatedAt"
>;

const Follower = sequelize.define<
  Model<FollowerAttributes, FollowerCreationAttributes>
>(
  "Follower",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "The user being followed (quiz creator)",
    },
    followerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "The user doing the following (student)",
    },
  },
  {
    tableName: "followers",
    indexes: [
      {
        unique: true,
        fields: ["userId", "followerId"],
        name: "followers_user_follower_unique",
      },
    ],
  },
);

export default Follower;
export { Follower };
