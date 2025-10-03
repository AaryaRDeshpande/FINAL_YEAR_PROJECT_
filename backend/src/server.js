import http from 'http';
import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { PORT } from './config/env.js';

async function start() {
  await connectToDatabase();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
