import express from 'express';
import { NotFoundError } from '../errors/not-found-error';
import { Database } from '../database/database';
import { ConflictError } from '../errors/conflict-error';
import {
  CustomRequest,
  IUserDeactivate,
  IUserNameChange,
  IUserRegister,
} from '../interfaces/requests';

const router = express.Router();
const db = Database.getInstance();

router.get('/', async (req, res) => {
  const allActiveUsers = await db.knex('users').where('active', true);

  res.status(200).send(allActiveUsers);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await db.knex('users').where('id', id).first();
  if (!user) throw new ConflictError('User not found');

  res.status(200).send(user);
});

router.post('/register', async (req: CustomRequest<IUserRegister>, res) => {
  const { name, email } = req.body;

  const existingUser = await db.knex('users').where('email', email).first();
  if (existingUser) throw new ConflictError('Email already in use');

  await db.knex('users').insert({ name, email });

  res.status(201).send();
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  const existingUser = await db.knex('users').where('id', id).first();
  if (!existingUser) throw new ConflictError('User not found');

  await db.knex('users').where('id', id).del();

  res.status(204).send();
});

router.patch(
  '/deactivate',
  async (req: CustomRequest<IUserDeactivate>, res) => {
    const { id } = req.body;

    const existingUser = await db.knex('users').where('id', id).first();
    if (!existingUser) throw new ConflictError('User not found');

    await db.knex('users').where('id', id).update('active', false);

    res.status(204).send();
  }
);

router.post(
  '/change-name',
  async (req: CustomRequest<IUserNameChange>, res) => {
    const { id, name } = req.body;

    const existingUser = await db.knex('users').where('id', id).first();
    if (!existingUser) throw new ConflictError('User not found');

    await db.knex('users').where('id', id).update('name', name);
    res.status(204).send();
  }
);

export { router as userRouter };
