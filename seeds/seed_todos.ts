import { Knex } from 'knex';
import { createId } from '@paralleldrive/cuid2';

export async function seed(knex: Knex): Promise<void> {
    await knex('todo').del();

    const todos = Array.from({ length: 10 }).map((_, index) => ({
        todo_id: createId(),
        user_id: createId(),
        title: `Todo item ${index + 1}`,
        completed: Math.random() < 0.5,
    }));

    await knex('todo').insert(todos);
}
