import { Sequelize } from "sequelize";
import { initBundleModel, initBundleProductModel, initProductModel } from "../models";

export const sequelize = new Sequelize('postgresql://shopifypartners_user:GikbCT0oNnXB2Q710c5ahjGP18CioZCK@dpg-cs8h3f5umphs73878u0g-a/shopifypartners', {

  dialectModule: require('pg'),
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,       // Enforce SSL
      rejectUnauthorized: false // If the SSL certificate is self-signed
    },
    connectTimeout: 60000
  },
  logging: false
});

export async function initDB() {
  try {
    await sequelize.authenticate();
    await initProductModel(sequelize);
    await initBundleModel(sequelize);
    await initBundleProductModel(sequelize);
    console.log('DB Initialized Successfully!');

  } catch (error) {
    console.error({ error: 'Database initialization failed!', details: error });
  }
}