import type { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'postgres',
            database: 'postgres',
        },
        migrations: {
            directory: './src/db/migrations',
        },
        seeds: {
            directory: './src/db/seeds',
        },
    },
    production: {
        client: 'pg',
        connection: process.env.DB_CONNECTION_STRING
            ? process.env.DB_CONNECTION_STRING
            : {
                host: process.env.DB_HOST || '/cloudsql/<YOUR_INSTANCE_CONNECTION_NAME>', // Cloud SQL Auth Proxy host for production
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: { rejectUnauthorized: false }, // Use SSL for Cloud SQL
            },
        migrations: {
            directory: './src/db/migrations',
        },
        seeds: {
            directory: './src/db/seeds',
        },
    },
};

export default config;
