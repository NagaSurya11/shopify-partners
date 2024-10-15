import express from 'express';
import * as path from 'path';
import { initDB } from './modules/db/sequelize';
import { initMiddleWare } from './modules/graphqls/initMiddleWare';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.static(path.join(__dirname, '../client')));

// Handle requests to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

console.log(path.join(__dirname, '../client', 'index.html'));


const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
  await initDB();
  await initMiddleWare(app);
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
