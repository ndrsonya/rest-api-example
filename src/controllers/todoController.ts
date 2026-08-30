import { Request, Response } from 'express';
import { TodoService } from '../services/todoService';
import { Todo, UpdateTodoInput } from '../types/todoTypes';
import { handleResponse, handleError } from '../helpers/responseHandler';

export const createTodoController = (todoService: TodoService) => ({
    getTodosByUserId: async (req: Request, res: Response): Promise<void> => {
        const { user_id } = req.params;

        try {
            const todos = await todoService.getTodosForUser(user_id);
            handleResponse<Todo[]>(todos, res);
        } catch (error) {
            handleError(error, res);
        }
    },

    createTodo: async (req: Request, res: Response): Promise<void> => {
        const { user_id, title } = req.body as { user_id?: unknown; title?: unknown };

        if (typeof user_id !== 'string' || !user_id || typeof title !== 'string' || !title) {
            res.status(400).json({ message: 'user_id and title are required.' });
            return;
        }

        try {
            const todo = await todoService.createTodo({ user_id, title });
            res.status(201).json(todo);
        } catch (error) {
            handleError(error, res);
        }
    },

    updateTodo: async (req: Request, res: Response): Promise<void> => {
        const { todo_id } = req.params;
        const { title, completed } = req.body as { title?: unknown; completed?: unknown };

        if (title === undefined && completed === undefined) {
            res.status(400).json({ message: 'At least one of title or completed is required.' });
            return;
        }

        if (title !== undefined && (typeof title !== 'string' || !title)) {
            res.status(400).json({ message: 'title must be a non-empty string.' });
            return;
        }

        if (completed !== undefined && typeof completed !== 'boolean') {
            res.status(400).json({ message: 'completed must be a boolean.' });
            return;
        }

        const updates: UpdateTodoInput = {
            ...(title !== undefined && { title }),
            ...(completed !== undefined && { completed }),
        };

        try {
            const todo = await todoService.updateTodo(todo_id, updates);
            handleResponse<Todo | null>(todo, res, 'No todo found for the given todo_id.');
        } catch (error) {
            handleError(error, res);
        }
    },

    deleteTodo: async (req: Request, res: Response): Promise<void> => {
        const { todo_id } = req.params;

        try {
            const deleted = await todoService.deleteTodo(todo_id);

            if (!deleted) {
                res.status(404).json({ message: 'No todo found for the given todo_id.' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            handleError(error, res);
        }
    },
});
