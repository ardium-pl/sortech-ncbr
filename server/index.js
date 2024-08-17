import cors from "cors";
import 'dotenv/config';
import express from "express";
import { clientRouter } from "./client.js";
import { createTestConnection } from "./config/database.js";
import { sorRouter } from "./routes/sor.js";
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/sor', sorRouter); 
app.use(clientRouter); 

app.listen(port, () => {
  logger.info(`Serwer SOR uruchomiony na porcie ${port}`);
  
  try {
    createTestConnection();
    logger.info(`Udało się połączyć z bazą danych`);
  } catch (err) {
    throw err;
  }
});

export default app;