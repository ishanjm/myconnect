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

// Initialization flag and promise
let isInitialSync = false;
let syncPromise: Promise<void> | null = null;

/**
 * Synchronize the database.
 * Explicitly import models here to ensure they are registered with Sequelize before sync.
 */
export const syncDB = async (force = false) => {
  if (isInitialSync && !force) return;
  if (syncPromise && !force) return syncPromise;

  syncPromise = (async () => {
    try {
      // Dynamic imports to avoid circular dependencies and ensure models are registered
      await import("../model/User");
      await import("../model/Post");
      await import("../model/Document");
      await import("../model/Location");
      await import("../model/DocumentCategory");
      await import("../model/Quiz");

      await sequelize.authenticate();
      // alter: false by default to avoid index bloat. 
      // Set to true manually once if you have schema changes.
      await sequelize.sync({ force, alter: false });

      isInitialSync = true;
      console.log(
        `[Database] Synchronized successfully (force: ${force}, alter: ${!force})`,
      );
    } catch (error) {
      console.error("[Database] Sync failed:", error);
      syncPromise = null; // Reset promise on failure to allow retry
      throw error;
    }
  })();

  return syncPromise;
};
