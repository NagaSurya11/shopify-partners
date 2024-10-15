import { Sequelize } from "sequelize";
import { initBundleModel, initBundleProductModel, initProductModel } from "../models";

export const sequelize = new Sequelize('shopify-partners', 'postgres', 'postgres', {
  host: 'localhost',
  dialectModule: require('pg'),
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
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