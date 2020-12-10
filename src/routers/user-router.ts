import express from 'express';
import { User } from '../interfaces/user';
import { Database } from '../database/database';
import { ConflictError } from '../errors/conflict-error';
import {
  CustomRequest,
  IUserDeactivate,
  IUserNameChange,
  IUserRegister,
} from '../interfaces/requests';
import { UserRepository } from '../repositories/user.repository';
import { NotificationService } from '../services/notification.service';

const router = express.Router();
const userRepository = new UserRepository(Database.getInstance());
const notificationService = new NotificationService();

router.get('/', async (req, res) => {
  const allActiveUsers = await userRepository.findAll<User>({ active: true });

  res.status(200).send(allActiveUsers);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.findOne<User>({ id: +id });
  if (!user) throw new ConflictError('User not found');

  res.status(200).send(user);
});

router.post('/register', async (req: CustomRequest<IUserRegister>, res) => {
  const { name, email } = req.body;

  const existingUser = await userRepository.findOne<User>({ email });
  if (existingUser) throw new ConflictError('Email already in use');

  const result = await userRepository.insert<User>({ name, email });

  if (result) {
    notificationService.sendNotification(result, 'register');
  }

  res.status(201).send(result);
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  const existingUser = await userRepository.findOne<User>({ id: +id });
  if (!existingUser) throw new ConflictError('User not found');

  await userRepository.delete<User>(existingUser);

  res.sendStatus(204);
});

router.patch(
  '/deactivate',
  async (req: CustomRequest<IUserDeactivate>, res) => {
    const { id } = req.body;

    const existingUser = await userRepository.findOne<User>({ id });
    if (!existingUser) throw new ConflictError('User not found');

    await userRepository.update<User>(existingUser, {
      active: false,
    });

    res.status(204).send();
  }
);

router.post(
  '/change-name',
  async (req: CustomRequest<IUserNameChange>, res) => {
    const { id, name } = req.body;

    const existingUser = await userRepository.findOne<User>({ id });
    if (!existingUser) throw new ConflictError('User not found');

    const updated = await userRepository.update<User>(existingUser, { name });
    res.status(201).send(updated);
  }
);

export { router as userRouter };
