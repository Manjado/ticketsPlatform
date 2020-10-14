import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesSessin from 'cookie-session';
import { errorHandler, NotFoundError } from '@webma/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookiesSessin({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
