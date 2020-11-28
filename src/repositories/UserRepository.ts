import { QueryBuilder } from 'knex';
import { BaseRepository } from './BaseRepository';
import { Database } from '../database/database';
import { User } from '../interfaces/user';

export class UserRepository extends BaseRepository {
  static readonly tableName = 'users';
  constructor(dbService: Database) {
    super(dbService, UserRepository.tableName);
  }

  findAll(options?: Partial<User>): QueryBuilder<User, User[]> {
    const query = this.baseQuery.clone();
    if (options) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          const value = options[key as keyof User];
          query.modify((queryBuilder: QueryBuilder) => {
            queryBuilder.where(key, value);
          });
        }
      }
    }
    return query;
  }

  findOne(options: Partial<User>): QueryBuilder<User, User> {
    const query = this.baseQuery.clone().first();
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const value = options[key as keyof User];
        query.modify((queryBuilder: QueryBuilder) => {
          queryBuilder.where(key, value);
        });
      }
    }
    return query;
  }

  insert(options: Partial<User>): QueryBuilder<User, User> {
    return this.baseQuery.clone().returning('*').insert(options);
  }

  update(user: User, options: Partial<User>): QueryBuilder<User, User> {
    const query = this.baseQuery.clone().where('id', user.id).first();
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const value = options[key as keyof User];
        query.modify((queryBuilder: QueryBuilder) => {
          queryBuilder.update(key, value, '*');
        });
      }
    }
    return query;
  }

  delete(options: Partial<User>): QueryBuilder<User, number> {
    const query = this.baseQuery.clone().del();
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const value = options[key as keyof User];
        query.modify((queryBuilder: QueryBuilder) => {
          queryBuilder.where(key, value);
        });
      }
    }
    return query;
  }
}
