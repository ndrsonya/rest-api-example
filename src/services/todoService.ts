import { TodoRepository } from '../repositories/todoRepository';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todoTypes';

export interface TodoService {
    getTodosForUser(userId: string): Promise<Todo[]>;
    createTodo(input: CreateTodoInput): Promise<Todo>;
    updateTodo(todo_id: string, updates: UpdateTodoInput): Promise<Todo | null>;
    deleteTodo(todo_id: string): Promise<boolean>;
}

export const createTodoService = (todoRepository: TodoRepository): TodoService => ({
    getTodosForUser: (userId: string): Promise<Todo[]> => {
        return todoRepository.fetchTodosByUserId(userId);
    },

    createTodo: (input: CreateTodoInput): Promise<Todo> => {
        return todoRepository.createTodo(input);
    },

    updateTodo: (todo_id: string, updates: UpdateTodoInput): Promise<Todo | null> => {
        return todoRepository.updateTodo(todo_id, updates);
    },

    deleteTodo: (todo_id: string): Promise<boolean> => {
        return todoRepository.deleteTodo(todo_id);
    },
});
