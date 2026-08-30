import { createTodoService } from '../src/services/todoService';
import { TodoRepository } from '../src/repositories/todoRepository';
import { Todo } from '../src/types/todoTypes';

describe('todoService', () => {
    const buildRepository = (overrides: Partial<TodoRepository> = {}): TodoRepository => ({
        fetchTodosByUserId: jest.fn(),
        createTodo: jest.fn(),
        updateTodo: jest.fn(),
        deleteTodo: jest.fn(),
        ...overrides,
    });

    describe('getTodosForUser', () => {
        it('delegates to the repository with the given userId', async () => {
            const todos: Todo[] = [
                { todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false },
            ];
            const fetchTodosByUserId = jest.fn().mockResolvedValue(todos);
            const service = createTodoService(buildRepository({ fetchTodosByUserId }));

            const result = await service.getTodosForUser('u1');

            expect(fetchTodosByUserId).toHaveBeenCalledWith('u1');
            expect(result).toBe(todos);
        });

        it('propagates errors thrown by the repository', async () => {
            const fetchTodosByUserId = jest.fn().mockRejectedValue(new Error('Error fetching todos'));
            const service = createTodoService(buildRepository({ fetchTodosByUserId }));

            await expect(service.getTodosForUser('u1')).rejects.toThrow('Error fetching todos');
        });
    });

    describe('createTodo', () => {
        it('delegates to the repository with the given input', async () => {
            const todo: Todo = { todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false };
            const createTodoFn = jest.fn().mockResolvedValue(todo);
            const service = createTodoService(buildRepository({ createTodo: createTodoFn }));

            const result = await service.createTodo({ user_id: 'u1', title: 'Buy milk' });

            expect(createTodoFn).toHaveBeenCalledWith({ user_id: 'u1', title: 'Buy milk' });
            expect(result).toBe(todo);
        });
    });

    describe('updateTodo', () => {
        it('delegates to the repository with the given id and updates', async () => {
            const todo: Todo = { todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: true };
            const updateTodoFn = jest.fn().mockResolvedValue(todo);
            const service = createTodoService(buildRepository({ updateTodo: updateTodoFn }));

            const result = await service.updateTodo('t1', { completed: true });

            expect(updateTodoFn).toHaveBeenCalledWith('t1', { completed: true });
            expect(result).toBe(todo);
        });

        it('returns null when the repository finds no matching todo', async () => {
            const updateTodoFn = jest.fn().mockResolvedValue(null);
            const service = createTodoService(buildRepository({ updateTodo: updateTodoFn }));

            const result = await service.updateTodo('missing', { completed: true });

            expect(result).toBeNull();
        });
    });

    describe('deleteTodo', () => {
        it('delegates to the repository with the given id', async () => {
            const deleteTodoFn = jest.fn().mockResolvedValue(true);
            const service = createTodoService(buildRepository({ deleteTodo: deleteTodoFn }));

            const result = await service.deleteTodo('t1');

            expect(deleteTodoFn).toHaveBeenCalledWith('t1');
            expect(result).toBe(true);
        });
    });
});
