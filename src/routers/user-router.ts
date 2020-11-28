import express from 'express';
import { Database } from '../database/database';
import { ConflictError } from '../errors/conflict-error';
import {
  CustomRequest,
  IUserDeactivate,
  IUserNameChange,
  IUserRegister,
} from '../interfaces/requests';
import { UserRepository } from '../repositories/UserRepository';

const router = express.Router();
const userRepository = new UserRepository(Database.getInstance());

router.get('/', async (req, res) => {
  const allActiveUsers = await userRepository.findAll({ active: true });

  res.status(200).send(allActiveUsers);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.findOne({ id: +id });
  if (!user) throw new ConflictError('User not found');

  res.status(200).send(user);
});

router.post('/register', async (req: CustomRequest<IUserRegister>, res) => {
  const { name, email } = req.body;

  const existingUser = await userRepository.findOne({ email });
  if (existingUser) throw new ConflictError('Email already in use');

  const result = await userRepository.insert({ name, email });

  res.status(201).send(result);
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  const existingUser = await userRepository.findOne({ id: +id });
  if (!existingUser) throw new ConflictError('User not found');

  await userRepository.delete({ id: +id });

  res.sendStatus(204);
});

router.patch(
  '/deactivate',
  async (req: CustomRequest<IUserDeactivate>, res) => {
    const { id } = req.body;

    const existingUser = await userRepository.findOne({ id });
    if (!existingUser) throw new ConflictError('User not found');

    await userRepository.update(existingUser, {
      active: false,
    });

    res.status(204).send();
  }
);

router.post(
  '/change-name',
  async (req: CustomRequest<IUserNameChange>, res) => {
    const { id, name } = req.body;

    const existingUser = await userRepository.findOne({ id });
    if (!existingUser) throw new ConflictError('User not found');

    const updated = await userRepository.update(existingUser, { name });
    res.status(201).send(updated);
  }
);

export { router as userRouter };
