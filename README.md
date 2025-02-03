# Node.js Device Management API

## Overview
This project provides an API for managing user devices and checking the API's health status. It is built using Node.js, Express, and Knex.js, with support for Swagger API documentation and Winston for logging.

---

## Features
- **Device Management:** Retrieve devices by user ID.
- **Health Status Check:** Verify the API and database connection status.
- **API Documentation:** Accessible through Swagger UI.
- **Robust Logging:** Comprehensive logging for errors and information.
- **CI/CD pipelines:** For automated releases of new versions (Google cloud hosting is currently off due to paid nature of service and tight author's budget)


---

## Installation
### Pre-requisites:
- [ ] Docker installed on your machine
- [ ] Node installed

### Set up local DB
1. In the project root folder run `docker compose build`
2. In the project root folder run `docker compose up -d` (runs postgres and PG Admin)
3. Go to http://localhost:8001 in browser. You'll see a pgAdmin login page
4. login with email `admin@admin.com` and password `admin`
5. Right Click on "Servers" -> "Create" -> "Server..."

  ![Screenshot 2024-12-18 at 15 55 09](https://github.com/user-attachments/assets/2c8e0d9e-6173-4b32-90c9-1d30c970bdfd)

6. on "General" tab give server some name
7. on "Connection" tab set the following Host: postgres, username: postgress, password: postgres

  ![Screenshot 2024-12-18 at 15 57 43](https://github.com/user-attachments/assets/b72598a8-c47d-4461-8c25-0133e39c4b79)
8. Click "Save"

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

3. Set up environment variables by creating a `.env` file in the root directory with the following content:
   ```env
   PORT=8080
   DB_HOST=postgres
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=postgres
   ```

4. Run database migrations if required (assuming Knex is set up):
   ```bash
   npx knex migrate:latest
   ```

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

### **Device Routes**
| Method | Endpoint            | Description                                       |
|--------|---------------------|---------------------------------------------------|
| GET    | `/devices/:user_id`  | Get devices associated with a given user ID.     |

#### Example Response
**GET /devices/q9m18b1frwn1kh4gun8c3g9o**
```json
[
  {
    "device_id": "xiiu1zushyiurb8xndqz3osc",
    "user_id": "q9m18b1frwn1kh4gun8c3g9o",
    "last_charging_timestamp": null
  }
]
```
**Error Responses:**
- 404: No devices found for the given user ID
- 500: Internal server error

### **Status Routes**
| Method | Endpoint | Description                               |
|--------|----------|-------------------------------------------|
| GET    | `/status` | Check API health and database connection |

#### Example Response
```json
{
  "status": "OK",
  "message": "API is healthy and the database connection is successful!"
}
```

---

## Project Structure
```
src
├── config
│   └── logger.ts
│   └── swaggerConfig.ts
├── controllers
│   └── deviceController.ts
│   └── statusController.ts
├── db
│   └── knex.ts
├── helpers
│   └── responseHandler.ts
├── repositories
│   └── deviceRepository.ts
├── routes
│   └── deviceRoutes.ts
│   └── statusRoutes.ts
└── types
    └── deviceTypes.ts
```

---

## DB
The app uses simple DB setup with only one table 

|               device              |                    
|-----------------------------------|
|device_id String PK                |
|user_id String Not Nul             |
|last_charging_timestamp   Timestamp|

## Dependencies
- **express:** Web framework for Node.js
- **dotenv:** Environment variable management
- **knex:** SQL query builder for Node.js
- **winston:** Logging library
- **swagger-jsdoc & swagger-ui-express:** API documentation
- **Github Actions** For CI/CD pipelines
- **Google cloud Run and Google cloud SQL** For app and DB hosting (Google cloud hosting is currently off due to paid nature of service and tight author's budget)


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

---

## Troubleshooting

### Database Connection Issue
- Ensure the database credentials are correct in the `.env` file.
- Verify that the database server is running.

### API Not Responding
- Check the logs for errors using the `app.log` file.

---

## Logging
- Logs are available in the console and written to `app.log`.
- Winston is used for logging, with support for different log levels.

---

## Contributing
Feel free to open issues or submit pull requests for improvements.

---

## License
This project is licensed under [MIT License](LICENSE).

