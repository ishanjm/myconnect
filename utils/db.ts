import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

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
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
);

// Initialization flag
let isInitialSync = false;

/**
 * Synchronize the database.
 * Explicitly import models here to ensure they are registered with Sequelize before sync.
 */
export const syncDB = async (force = false) => {
  if (isInitialSync && !force) return;

  try {
    // Dynamic imports to avoid circular dependencies and ensure models are registered
    await import("../model/User");
    await import("../model/Post");
    await import("../model/Document");
    await import("../model/Location");
    await import("../model/DocumentCategory");
    await import("../model/Quiz");

    await sequelize.authenticate();
    // Use alter: true in dev to sync changes without dropping data
    await sequelize.sync({ force, alter: !force });

    isInitialSync = true;
    console.log(
      `[Database] Synchronized successfully (force: ${force}, alter: ${!force})`,
    );
  } catch (error) {
    console.error("[Database] Sync failed:", error);
    throw error;
  }
};
