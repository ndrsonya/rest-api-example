import express, { Request, Response, Express } from 'express';
import knex from './db/knex';

// Create Express application
const app: Express = express();
const port = process.env.PORT || 8080;

// Function to validate DB connection
async function validateDbConnection() {
    try {
        const result = await knex.raw('SELECT 1');
        console.log('Database connection successful:');
    } catch (error) {
        console.error('Database connection failed:');
    } finally {
        knex.destroy();
    }
}

// Run the validation
validateDbConnection();

// Middleware to parse JSON
app.use(express.json());

// Default route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

// Endpoint to get devices by user_id
app.get('/devices/:user_id', async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.params;

    try {
        const devices = await knex('device').where({ user_id });


        if (devices.length === 0) {
            return res.status(404).json({ message: 'No devices found for the given user_id.' });
        }


        return res.status(200).json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});