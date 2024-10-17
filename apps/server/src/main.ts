import express from 'express';
import * as path from 'path';
import { initDB } from './modules/db/sequelize';
import { initMiddleWare } from './modules/graphqls/initMiddleWare';
import helmet from 'helmet';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(helmet());
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
  await initDB();
  await initMiddleWare(app);
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
