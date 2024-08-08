import 'dotenv/config';
import express from "express";
import cors from "cors";
import winston from "winston";
import {sorRouter} from "./routes/sor.js";
import {logger} from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());  // Middleware do parsowania JSON
app.use(cors());  // Middleware do obsługi CORS

app.use('/api/sor', sorRouter);  // Ustawienie routera dla endpointów SOR

// Middleware do obsługi błędów
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Coś poszło nie tak!');
});

// Nasłuchiwanie na porcie
app.listen(port, () => {
    logger.info(`Serwer SOR uruchomiony na porcie ${port}`);
});

export default app;