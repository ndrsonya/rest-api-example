import { Express } from 'express';
import request from 'supertest';
import createApp from '../src/app';
import { startTestDatabase, stopTestDatabase, TestDatabase } from './testDatabase';

describe('Todo routes (integration)', () => {
    let testDatabase: TestDatabase;
    let app: Express;

    beforeAll(async () => {
        testDatabase = await startTestDatabase();
        app = createApp(testDatabase.db);
    });

    afterEach(async () => {
        await testDatabase.db('todo').del();
    });

    afterAll(async () => {
        await stopTestDatabase(testDatabase);
    });

    describe('GET /todos/:user_id', () => {
        it('returns 200 with the todos belonging to the given user_id', async () => {
            await testDatabase.db('todo').insert([
                { todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false },
                { todo_id: 't2', user_id: 'u1', title: 'Walk the dog', completed: true },
                { todo_id: 't3', user_id: 'u2', title: 'Do laundry', completed: false },
            ]);

            const response = await request(app).get('/todos/u1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false },
                { todo_id: 't2', user_id: 'u1', title: 'Walk the dog', completed: true },
            ]);
        });

        it('returns 200 with an empty array when the user has no todos', async () => {
            const response = await request(app).get('/todos/unknown-user');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /todos', () => {
        it('returns 201 with the created todo and persists it', async () => {
            const response = await request(app).post('/todos').send({ user_id: 'u1', title: 'Buy milk' });

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({ user_id: 'u1', title: 'Buy milk', completed: false });
            expect(typeof response.body.todo_id).toBe('string');

            const listResponse = await request(app).get('/todos/u1');
            expect(listResponse.body).toEqual([response.body]);
        });

        it('returns 400 when title is missing', async () => {
            const response = await request(app).post('/todos').send({ user_id: 'u1' });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /todos/:todo_id', () => {
        it('returns 200 with the updated todo', async () => {
            await testDatabase.db('todo').insert({ todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false });

            const response = await request(app).put('/todos/t1').send({ completed: true });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: true });
        });

        it('returns 404 when the todo does not exist', async () => {
            const response = await request(app).put('/todos/missing').send({ completed: true });

            expect(response.status).toBe(404);
        });

        it('returns 400 when the body has no updatable fields', async () => {
            const response = await request(app).put('/todos/t1').send({});

            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /todos/:todo_id', () => {
        it('returns 204 and removes the todo', async () => {
            await testDatabase.db('todo').insert({ todo_id: 't1', user_id: 'u1', title: 'Buy milk', completed: false });

            const response = await request(app).delete('/todos/t1');

            expect(response.status).toBe(204);

            const listResponse = await request(app).get('/todos/u1');
            expect(listResponse.body).toEqual([]);
        });

        it('returns 404 when the todo does not exist', async () => {
            const response = await request(app).delete('/todos/missing');

            expect(response.status).toBe(404);
        });
    });
});
