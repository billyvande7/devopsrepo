import 'dotenv/config';
import express from 'express';
import urlShortenerRouter from './controller/url-shortener.controller.js';
import authRouter from './controller/auth.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use('/', urlShortenerRouter);
app.use('/', authRouter);

app.listen(PORT, () => {
    console.log(`URL shortener service running on http://localhost:${PORT} in ${NODE_ENV} mode`);
});
