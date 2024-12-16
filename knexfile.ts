const Knex = require("knex");
const dotenv = require('dotenv');
dotenv.config();

/** @type {import("knex").Knex.Config} */
module.exports = {
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
        connection: process.env.DB_CONNECTION_STRING || {
            host: process.env.DB_HOST || '/cloudsql/YOUR_INSTANCE_CONNECTION_NAME',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false },  // SSL for Cloud SQL
        },
        migrations: {
            directory: './src/db/migrations',
        },
        seeds: {
            directory: './src/db/seeds',
        },
    },
};