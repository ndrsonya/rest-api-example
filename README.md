# Node.js Todo API

## Overview
This project provides an API for managing user todos and checking the API's health status. It is built using Node.js, Express, and Knex.js, with support for Swagger API documentation and Winston for logging.

---

## Features
- **Todo Management:** Create, list, update, and delete todos for a user.
- **Health Status Check:** Verify the API and database connection status.
- **API Documentation:** Accessible through Swagger UI.
- **Robust Logging:** Logging for errors and information.
- **CI/CD pipelines:** For automated releases of new versions (Google cloud hosting is currently off due to paid nature of service and tight author's budget)


---

## Installation
### Pre-requisites:
- [ ] Docker installed on your machine
- [ ] Node installed

### Project Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/ndrsonya/rest-api-example
   cd rest-api-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

### Set up local DB
Run:
```bash
npm run db:up
```
This starts Postgres and pgAdmin via `docker compose` (waiting until Postgres is actually ready to accept connections), then runs migrations and seeds in one shot - no manual pgAdmin clicking required.

If you just want the containers without migrating/seeding, `docker compose up -d --wait` on its own works too; `npm run migrate-and-seed` can be run separately whenever you need to re-apply migrations/seeds.


---

## Usage

### Start the Application
```bash
npm start
```
The API will be available at `http://localhost:8080`.

### Access Swagger API Documentation
Visit:
```
http://localhost:8080/api-docs
```

---

## API Endpoints

### **Todo Routes**
| Method | Endpoint            | Description                                  |
|--------|----------------------|-----------------------------------------------|
| GET    | `/todos/:user_id`    | Get todos associated with a given user ID.    |
| POST   | `/todos`             | Create a todo.                                |
| PATCH  | `/todos/:todo_id`    | Update a todo's title and/or completed status. |
| DELETE | `/todos/:todo_id`    | Delete a todo.                                |

#### Example Response
**GET /todos/q9m18b1frwn1kh4gun8c3g9o**
```json
[
  {
    "todo_id": "xiiu1zushyiurb8xndqz3osc",
    "user_id": "q9m18b1frwn1kh4gun8c3g9o",
    "title": "Buy milk",
    "completed": false
  }
]
```
If the user has no todos, the response is `200` with an empty array (`[]`) - an empty result set isn't an error.

**POST /todos**
```json
// Request body
{ "user_id": "q9m18b1frwn1kh4gun8c3g9o", "title": "Buy milk" }
```
Returns `201` with the created todo, or `400` if `user_id`/`title` are missing.

**PATCH /todos/:todo_id**
```json
// Request body
{ "completed": true }
```
Returns `200` with the updated todo, `400` if neither `title` nor `completed` is provided, or `404` if the todo doesn't exist.

**DELETE /todos/:todo_id**
Returns `204` on success, or `404` if the todo doesn't exist.

**Error Responses:**
- 500: Internal server error

### **Status Routes**
| Method | Endpoint       | Description                                                       |
|--------|----------------|---------------------------------------------------------------------|
| GET    | `/health/live`  | Liveness probe - is the process up? Does not check the database   |
| GET    | `/health/ready` | Readiness probe - is the API healthy and the database reachable?  |

#### Example Response (`/health/ready`)
```json
{
  "status": "OK",
  "message": "API is healthy and the database connection is successful!"
}
```

---

## Project Structure

A layered architecture: routes hand off to controllers, controllers call a thin service layer, services call the repository, and the repository talks to the DB via Knex.

```
src
├── app.ts          -- Express app construction (middleware, routes, error handling)
├── index.ts        -- starts the server, handles graceful shutdown
├── config          -- app-wide configuration and setup
├── controllers     -- handles incoming requests and outgoing responses
├── helpers         -- shared, reusable utility functions
├── middleware      -- cross-cutting Express middleware
├── repositories    -- data access layer
├── routes          -- API route definitions
├── services        -- business logic layer
└── types           -- shared TypeScript type definitions

migrations/          -- Knex schema migrations (project root)
seeds/               -- Knex seed data (project root)
knexfile.ts          -- Knex CLI config (project root)
```

---

## DB
The app uses simple DB setup with only one table

|               todo         |
|-----------------------------|
|todo_id String PK           |
|user_id String Not Null     |
|title String Not Null       |
|completed Boolean Not Null  |

## Dependencies
- **express:** Web framework for Node.js
- **dotenv:** Environment variable management
- **knex:** SQL query builder for Node.js
- **winston:** Logging library
- **swagger-jsdoc & swagger-ui-express:** API documentation
- **Github Actions** For CI/CD pipelines

---

## Development

### Run the App in Development Mode
```bash
npm run dev
```

### Lint the Code
```bash
npm run lint
```

### Run Tests
```bash
npm test                  # unit tests - mocked collaborators, no Docker required
npm run test:integration  # integration tests - spins up a real Postgres via testcontainers, requires Docker
npm run test:all          # both, one after the other
```

---


## Logging
- Logs are written to the console (stdout) only - colorized plain text in development, structured JSON in production (`NODE_ENV=production`), so a container platform's log collector (e.g. Google Cloud Logging) can capture and parse them.
- Winston is used for logging, with support for different log levels.

---

## Out of Scope
This project is a demo API and intentionally leaves out some things a production deployment would need:
- **Authentication:** No authentication or authorization is implemented - all endpoints are open. A production version would need to verify caller identity (e.g. OAuth) and enforce that a user can only access their own todos.
- **Cloud deployment:** The app runs locally via Docker Compose only. There is no live cloud deployment provisioning a managed Postgres instance, hosting the API on a cloud platform, and wiring up secrets management.
- **Validation:** Validation is minimal - request bodies get basic type/presence checks, and `.env` variables aren't validated at startup. A production version would need a schema-based validation library (e.g. Zod/Joi) for both incoming requests and environment configuration, with clear startup failures for missing/malformed env vars.
- **Observability:** No observability tooling is set up beyond  logging (see the Logging section above) - there's no metrics collection, distributed tracing, or error monitoring/alerting (e.g. Grafana, OpenTelemetry).
- **Gateway/load balancing:** There's no reverse proxy or API gateway in front of the app - a single instance handles requests directly. A production deployment would need a gateway (e.g. NGINX, cloud load balancer) to distribute traffic across pods/instances, and handle concerns like rate limiting.

---


## License
This project is licensed under [MIT License](LICENSE).

