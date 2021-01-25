import 'reflect-metadata';
import 'dotenv/config'

import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import router from './routes';

const app = express()

app.use(cors())
app.use(express.json())
app.use('/', router)

const port = process.env.PORT || 3333

app.listen(port, () => {
  console.log("Server running on port " + port)
})