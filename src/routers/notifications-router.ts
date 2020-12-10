import express from 'express';
import {
  CustomRequest,
  INewNotificationTemplate,
  IUpdateNotificationTemplate,
} from '../interfaces/requests';
import { Database } from '../database/database';
import { NotificationTemplateRepository } from '../repositories/notification_template.repository';
import { NotificationTemplate } from '../interfaces/notification_template';
import { ConflictError } from '../errors/conflict-error';

const router = express.Router();
const notificationTemplateRepository = new NotificationTemplateRepository(
  Database.getInstance()
);

router.get('/', async (req, res) => {
  const allNotificationTemplates = await notificationTemplateRepository.findAll<NotificationTemplate>();

  res.status(200).send(allNotificationTemplates);
});

router.post('/', async (req: CustomRequest<INewNotificationTemplate>, res) => {
  const result = await notificationTemplateRepository.insert<NotificationTemplate>(
    req.body
  );

  res.status(201).send(result);
});

router.patch('/', async (req: CustomRequest<IUpdateNotificationTemplate>, res) => {
    const existing = await notificationTemplateRepository.findOne<NotificationTemplate>(
      { id: req.body.id }
    );

    if (!existing) throw new ConflictError('Notification not found');

    const {id, ...updated} = req.body;
    const result = await notificationTemplateRepository.update<NotificationTemplate>(existing, updated);

    res.status(201).send(result);
  }
);

export { router as notificationsRouter };
