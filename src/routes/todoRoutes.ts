import express, { Router } from 'express';
import { TodoService } from '../services/todoService';
import { createTodoController } from '../controllers/todoController';

export const createTodoRoutes = (todoService: TodoService): Router => {
    const router = express.Router();
    const todoController = createTodoController(todoService);

    router.get('/todos/:user_id', todoController.getTodosByUserId);
    router.post('/todos', todoController.createTodo);
    router.put('/todos/:todo_id', todoController.updateTodo);
    router.delete('/todos/:todo_id', todoController.deleteTodo);

    return router;
};

/**
 * @openapi
 * /todos/{user_id}:
 *   get:
 *     summary: Retrieve a list of todos belonging to a user
 *     description: Returns an array of todos belonging to the specified user.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: string
 *           example: q9m18b1frwn1kh4gun8c3g9o
 *     responses:
 *       200:
 *         description: A list of todos belonging to the user. Returns an empty array if the user has no todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   todo_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   completed:
 *                     type: boolean
 *             example:
 *               - todo_id: "xiiu1zushyiurb8xndqz3osc"
 *                 user_id: "q9m18b1frwn1kh4gun8c3g9o"
 *                 title: "Buy milk"
 *                 completed: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'Internal server error.'
 */

/**
 * @openapi
 * /todos:
 *   post:
 *     summary: Create a todo
 *     description: Creates a new todo for the given user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - title
 *             properties:
 *               user_id:
 *                 type: string
 *               title:
 *                 type: string
 *             example:
 *               user_id: "q9m18b1frwn1kh4gun8c3g9o"
 *               title: "Buy milk"
 *     responses:
 *       201:
 *         description: The created todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo_id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 completed:
 *                   type: boolean
 *             example:
 *               todo_id: "xiiu1zushyiurb8xndqz3osc"
 *               user_id: "q9m18b1frwn1kh4gun8c3g9o"
 *               title: "Buy milk"
 *               completed: false
 *       400:
 *         description: user_id and title are required
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /todos/{todo_id}:
 *   put:
 *     summary: Update a todo
 *     description: Updates a todo's title and/or completed status.
 *     parameters:
 *       - in: path
 *         name: todo_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *             example:
 *               completed: true
 *     responses:
 *       200:
 *         description: The updated todo
 *       400:
 *         description: At least one of title or completed is required, or a field has the wrong type
 *       404:
 *         description: No todo found for the given todo_id
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a todo
 *     description: Deletes the todo with the given todo_id.
 *     parameters:
 *       - in: path
 *         name: todo_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The todo was deleted
 *       404:
 *         description: No todo found for the given todo_id
 *       500:
 *         description: Internal server error
 */
