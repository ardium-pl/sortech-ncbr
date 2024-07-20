import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors())

console.log('[Server] Starting up...');

app.listen(port, () => {
  console.log(`[Server] Server is running on port ${chalk.green.underline(port)}.`);
});

export default app;