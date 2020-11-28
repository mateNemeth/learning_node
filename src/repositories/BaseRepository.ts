import { QueryBuilder } from 'knex';
import { User } from '../interfaces/user';
import { Database } from '../database/database';

export abstract class BaseRepository {
  protected baseQuery: QueryBuilder;

  constructor(dbService: Database, tableName: string) {
    this.baseQuery = dbService.knex(tableName);
  }

  abstract findAll(): QueryBuilder;
  abstract findOne(options: { [key: string]: any }): QueryBuilder;
  abstract insert(options: { [key: string]: any }): void;
  abstract update(user: User, options: { [key: string]: any }): void;
  abstract delete(options: { [key: string]: any }): QueryBuilder;
}
