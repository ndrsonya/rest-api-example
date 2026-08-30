
import { Knex } from 'knex';
import { createId } from '@paralleldrive/cuid2';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todoTypes';
import logger from '../config/logger';

export interface TodoRepository {
    fetchTodosByUserId(user_id: string): Promise<Todo[]>;
    createTodo(input: CreateTodoInput): Promise<Todo>;
    updateTodo(todo_id: string, updates: UpdateTodoInput): Promise<Todo | null>;
    deleteTodo(todo_id: string): Promise<boolean>;
}

export const createTodoRepository = (db: Knex): TodoRepository => ({
    fetchTodosByUserId: async (user_id: string): Promise<Todo[]> => {
        try {
            const todos: Todo[] = await db('todo').where({ user_id });
            return todos;
        } catch (error) {
            logger.error(error)
            throw new Error('Error fetching todos');
        }
    },

    createTodo: async ({ user_id, title }: CreateTodoInput): Promise<Todo> => {
        try {
            const todo: Todo = { todo_id: createId(), user_id, title, completed: false };
            await db('todo').insert(todo);
            return todo;
        } catch (error) {
            logger.error(error)
            throw new Error('Error creating todo');
        }
    },

    updateTodo: async (todo_id: string, updates: UpdateTodoInput): Promise<Todo | null> => {
        try {
            const [updated]: Todo[] = await db('todo').where({ todo_id }).update(updates).returning('*');
            return updated ?? null;
        } catch (error) {
            logger.error(error)
            throw new Error('Error updating todo');
        }
    },

    deleteTodo: async (todo_id: string): Promise<boolean> => {
        try {
            const deletedCount: number = await db('todo').where({ todo_id }).del();
            return deletedCount > 0;
        } catch (error) {
            logger.error(error)
            throw new Error('Error deleting todo');
        }
    },
});
