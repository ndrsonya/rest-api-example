# rest-api-example


## Description
This is a simple REST API app build to demo backend development skills. The API provides endpoints to manage and manipulate customer device data stored in the database.


## Tech Stack
* Node JS
* TypeScript
* PostgreSQL
* Google Cloud Platform (app and DB hosting)
* Github actions (CI/CD)
* Docker (the app on the cloud runs in a container)
  

## API live 🥳
Temporarily off due to free tier google cloud plan  🤪



## DB
The app uses simple DB setup with only one table 

|               device              |                    
|-----------------------------------|
|device_id String PK                |
|user_id String Not Nul             |
|last_charging_timestamp   Timestamp|


Please note, that for local developemt local PostgreSQL instance is used, the deployed app is connected to the Google Cloud SQL instance.


## Loading... 🔜  further project improvements steps:
- [ ] Set up git hooks with Husky (don't allow to push commits if the code doesn't pass linting checks)
- [ ] Add integration tests to validate correct endpoint behaviour
- [ ] Add linting stage to CI/CD 
- [ ] Automate DB changes - the DB migrations should run when we try to deploy a new app version
- [ ] Add an index on user_id in DB table to speed up filtering queries



## Local Development Setup

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

### Set up application
1. In the project root folder run `npm install`
2. Create .env file in the project root folder and copy there contect from .env.example
3. run `npm run migrate-and-seed`
4. run the app with `npm run dev`
5. check out swagger docs at http://localhost:8080/api-docs/
6. run tests `npm run test`
7. run linter `npm run lint`
