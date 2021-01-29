import 'reflect-metadata';
import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';
import router from '@shared/infra/http/routes';

import '@shared/container';
import upload from '@config/upload';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(upload.uploadsFolder));
app.use('/', router);

app.use((err: Error, _: Request, response: Response, __: NextFunction) => {
  console.log({ err });

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
