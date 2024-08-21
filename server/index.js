import cors from 'cors';
import express, { json } from 'express';
import { clientRouter } from './client.js';
import { createTestConnection } from './config/database.js';
import { sorRouter } from './routes/sor.js';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/sor', sorRouter);
// app.use(clientRouter);

app.listen(port, async () => {
  // logger.info(`Serwer SOR uruchomiony na porcie ${port}`);
  console.log(`Serwer SOR uruchomiony na porcie ${port}`);

  // Test the connection
  let connection;
  try {
    connection = await createTestConnection();
    // logger.info(`Udało się połączyć z bazą danych`);
    console.log('Successfully established a test connection! ✅');

    // Catch error if any
  } catch (err) {
    throw err;

    // Close the connection after testing
  } finally {
    if (connection) {
      await connection.end();
      console.log('Closing a test connection...\n');
    }
  }
});

export default app;
