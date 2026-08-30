export interface Todo {
    todo_id: string;
    user_id: string;
    title: string;
    completed: boolean;
}

export interface CreateTodoInput {
    user_id: string;
    title: string;
}

export interface UpdateTodoInput {
    title?: string;
    completed?: boolean;
}
