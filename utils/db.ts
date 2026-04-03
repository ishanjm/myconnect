import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

export const sequelize = new Sequelize(
  process.env.DB_NAME || "myconnect",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    dialectModule: mysql2,
    define: {
      freezeTableName: true,
    },
    dialectOptions: {
      connectTimeout: 10000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

let isInitialSync = false;
export const syncDB = async (force = false) => {
  if (isInitialSync && !force) return;
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force });
    isInitialSync = true;
    console.log(`Database synchronized successfully (force: ${force})`);
  } catch (error) {
    console.error('Unable to synchronize database:', error);
    throw error;
  }
};
