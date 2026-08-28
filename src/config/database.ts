import Knex from 'knex';
import knexConfig from '../../knexfile';
import { env } from 'process';

const environment = env.NODE_ENV || 'development';
const config = knexConfig[environment];

const knex = Knex(config);

export default knex;
