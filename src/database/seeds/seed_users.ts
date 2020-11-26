import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    { name: 'Teszt Elek', email: 'tesztelek@email.com' },
    { name: 'Jó Áron', email: 'joaron@email.com' },
    { name: 'Lapos Elemér', email: 'laposelemer@email.com' },
  ]);
}
