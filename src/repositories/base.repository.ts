import { QueryBuilder } from 'knex';
import { Database } from '../database/database';

interface DBData {
  id: number
}

export abstract class BaseRepository {
  protected baseQuery: QueryBuilder;

  constructor(dbService: Database, tableName: string) {
    this.baseQuery = dbService.knex(tableName);
  }

  findAll<T extends DBData>(options?: Partial<T>): QueryBuilder<T, T[]> {
    const query = this.baseQuery.clone();
    if (options) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          const value = options[key as keyof T];
          query.modify((queryBuilder: QueryBuilder) => {
            queryBuilder.where(key, value);
          });
        }
      }
    }
    return query;
  }

  findOne<T extends DBData>(options: Partial<T>): QueryBuilder<T, T> {
    const query = this.baseQuery.clone().first();
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const value = options[key as keyof T];
        query.modify((queryBuilder: QueryBuilder) => {
          queryBuilder.where(key, value);
        });
      }
    }
    return query;
  }

  insert<T extends DBData>(options: Partial<T>): QueryBuilder<T, T> {
    return this.baseQuery.clone().returning('*').insert(options);
  }

  update<T extends DBData>(data: T, options: Partial<T>): QueryBuilder<T, T> {
    const query = this.baseQuery.clone().first().where('id', data.id);
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const value = options[key as keyof T];
        query.modify((queryBuilder: QueryBuilder) => {
          queryBuilder.update(key, value, '*');
        });
      }
    }
    return query;
  }

  delete<T extends DBData>(data: T): QueryBuilder<T, number> {
    const query = this.baseQuery.clone().del();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof T];
        query.modify((queryBuilder: QueryBuilder) => {
          queryBuilder.where(key, value);
        });
      }
    }
    return query;
  }
}
