import { BaseRepository } from './base.repository';
import { Database } from '../database/database';

export class UserRepository extends BaseRepository {
  static readonly tableName = 'users';
  constructor(dbService: Database) {
    super(dbService, UserRepository.tableName);
  }
}
