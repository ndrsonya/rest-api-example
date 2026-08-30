import { Request, Response } from 'express';
import { createTodoController } from '../src/controllers/todoController';
import { TodoService } from '../src/services/todoService';
import { Todo } from '../src/types/todoTypes';

jest.mock('../src/config/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
}));

describe('todoController', () => {
    let res: Response;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });

    const buildTodoService = (overrides: Partial<TodoService> = {}): TodoService => ({
        getTodosForUser: jest.fn(),
        createTodo: jest.fn(),
        updateTodo: jest.fn(),
        deleteTodo: jest.fn(),
        ...overrides,
    });

    describe('getTodosByUserId', () => {
        const buildReq = (user_id: string) => ({ params: { user_id } }) as unknown as Request;

        it('returns 200 with the todos for the given user_id', async () => {
            const todos: Todo[] = [{ todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false }];
            const getTodosForUser = jest.fn().mockResolvedValue(todos);
            const controller = createTodoController(buildTodoService({ getTodosForUser }));

            await controller.getTodosByUserId(buildReq('u1'), res);

            expect(getTodosForUser).toHaveBeenCalledWith('u1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(todos);
        });

        it('returns 200 with an empty array when the user has no todos', async () => {
            const getTodosForUser = jest.fn().mockResolvedValue([]);
            const controller = createTodoController(buildTodoService({ getTodosForUser }));

            await controller.getTodosByUserId(buildReq('u1'), res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('returns 500 when the service throws', async () => {
            const getTodosForUser = jest.fn().mockRejectedValue(new Error('Error fetching todos'));
            const controller = createTodoController(buildTodoService({ getTodosForUser }));

            await controller.getTodosByUserId(buildReq('u1'), res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
        });
    });

    describe('createTodo', () => {
        const buildReq = (body: unknown) => ({ body }) as unknown as Request;

        it('returns 201 with the created todo', async () => {
            const todo: Todo = { todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false };
            const createTodoFn = jest.fn().mockResolvedValue(todo);
            const controller = createTodoController(buildTodoService({ createTodo: createTodoFn }));

            await controller.createTodo(buildReq({ user_id: 'u1', title: 'Buy milk' }), res);

            expect(createTodoFn).toHaveBeenCalledWith({ user_id: 'u1', title: 'Buy milk' });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(todo);
        });

        it('returns 400 when user_id is missing', async () => {
            const createTodoFn = jest.fn();
            const controller = createTodoController(buildTodoService({ createTodo: createTodoFn }));

            await controller.createTodo(buildReq({ title: 'Buy milk' }), res);

            expect(createTodoFn).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 400 when title is missing', async () => {
            const createTodoFn = jest.fn();
            const controller = createTodoController(buildTodoService({ createTodo: createTodoFn }));

            await controller.createTodo(buildReq({ user_id: 'u1' }), res);

            expect(createTodoFn).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 500 when the service throws', async () => {
            const createTodoFn = jest.fn().mockRejectedValue(new Error('Error creating todo'));
            const controller = createTodoController(buildTodoService({ createTodo: createTodoFn }));

            await controller.createTodo(buildReq({ user_id: 'u1', title: 'Buy milk' }), res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
        });
    });

    describe('updateTodo', () => {
        const buildReq = (todo_id: string, body: unknown) => ({ params: { todo_id }, body }) as unknown as Request;

        it('returns 200 with the updated todo', async () => {
            const todo: Todo = { todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: true };
            const updateTodoFn = jest.fn().mockResolvedValue(todo);
            const controller = createTodoController(buildTodoService({ updateTodo: updateTodoFn }));

            await controller.updateTodo(buildReq('t1', { completed: true }), res);

            expect(updateTodoFn).toHaveBeenCalledWith('t1', { completed: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(todo);
        });

        it('returns 400 when neither title nor completed is provided', async () => {
            const updateTodoFn = jest.fn();
            const controller = createTodoController(buildTodoService({ updateTodo: updateTodoFn }));

            await controller.updateTodo(buildReq('t1', {}), res);

            expect(updateTodoFn).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 404 when the todo does not exist', async () => {
            const updateTodoFn = jest.fn().mockResolvedValue(null);
            const controller = createTodoController(buildTodoService({ updateTodo: updateTodoFn }));

            await controller.updateTodo(buildReq('missing', { completed: true }), res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 500 when the service throws', async () => {
            const updateTodoFn = jest.fn().mockRejectedValue(new Error('Error updating todo'));
            const controller = createTodoController(buildTodoService({ updateTodo: updateTodoFn }));

            await controller.updateTodo(buildReq('t1', { completed: true }), res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
        });
    });

    describe('deleteTodo', () => {
        const buildReq = (todo_id: string) => ({ params: { todo_id } }) as unknown as Request;

        it('returns 204 when the todo is deleted', async () => {
            const deleteTodoFn = jest.fn().mockResolvedValue(true);
            const controller = createTodoController(buildTodoService({ deleteTodo: deleteTodoFn }));

            await controller.deleteTodo(buildReq('t1'), res);

            expect(deleteTodoFn).toHaveBeenCalledWith('t1');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('returns 404 when the todo does not exist', async () => {
            const deleteTodoFn = jest.fn().mockResolvedValue(false);
            const controller = createTodoController(buildTodoService({ deleteTodo: deleteTodoFn }));

            await controller.deleteTodo(buildReq('missing'), res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 500 when the service throws', async () => {
            const deleteTodoFn = jest.fn().mockRejectedValue(new Error('Error deleting todo'));
            const controller = createTodoController(buildTodoService({ deleteTodo: deleteTodoFn }));

            await controller.deleteTodo(buildReq('t1'), res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
        });
    });
});
