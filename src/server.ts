import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { userRouter } from './routers/user-router';

const port = 3000;
const app = express();
app.use(json());

app.use('/users', userRouter);

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
