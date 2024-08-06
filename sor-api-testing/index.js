import 'dotenv/config';
import express from "express";
import cors from "cors";
import {sorRouter} from "./routes/sor.js";
import {personelRouter} from "./routes/personel.js";
import {lekiRouter} from "./routes/leki.js";
import {logger} from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/sor', sorRouter);
// app.use('/api/personel', personelRouter);
// app.use('/api/leki', lekiRouter);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Coś poszło nie tak!');
});

app.listen(port, () => {
    logger.info(`Serwer SOR uruchomiony na porcie ${port}`);
});

export default app;