import { BaseRepository } from './base.repository';
import { Database } from '../database/database';

export class NotificationTemplateRepository extends BaseRepository {
  static readonly tableName = 'notification_templates';
  constructor(dbService: Database) {
    super(dbService, NotificationTemplateRepository.tableName);
  }
}
