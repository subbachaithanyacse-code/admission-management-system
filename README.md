# Admission Management System

## 1. Project Overview

The Admission Management System is a web-based application developed to manage students, courses, and admissions using a microservices architecture.

The system provides a centralized platform for managing admission-related information through REST APIs and a React-based frontend.

## 2. Technologies Used

* **Backend:** Golang
* **Architecture:** Microservices
* **API:** REST API
* **API Gateway:** Golang Reverse Proxy
* **Database:** PostgreSQL
* **Database Tool:** pgAdmin
* **Frontend:** React.js
* **HTTP Client:** Axios
* **Routing:** React Router
* **Version Control:** Git and GitHub
* **Development Tool:** Visual Studio Code

## 3. Main Modules

### Student Service

Manages student information.

Features:

* Add student
* View students
* Update student
* Delete student
* Pagination
* Validation

Port:

`8081`

### Admission Service

Manages admission information.

Features:

* Create admission
* View admissions
* Update admission
* Delete admission
* Pagination
* Validation

Port:

`8084`

### Course Service

Manages course information.

Features:

* Add course
* View courses
* Update course
* Delete course
* Pagination
* Validation

Port:

`8085`

### API Gateway

The API Gateway provides a single entry point for the frontend and forwards requests to the appropriate microservice.

Port:

`8086`

Routes:

* `/students`
* `/courses`
* `/admissions`
* `/login`
* `/users`

### React Frontend

The frontend provides the user interface for:

* Dashboard
* Students
* Courses
* Admissions
* Reports
* Users

The React development server can run on the configured localhost port.

## 4. API Gateway Architecture

```text
                    React Frontend
                         |
                         |
                    API Gateway
                     Port 8086
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
   Student Service  Course Service  Admission Service
      Port 8081       Port 8085        Port 8084
          |              |              |
          +--------------+--------------+
                         |
                         v
                    PostgreSQL
                     admissiondb
```

## 5. Pagination

The APIs support pagination so that a large number of records are not returned in a single API request.

Example:

```text
/students?page=1&limit=10
/courses?page=1&limit=10
/admissions?page=1&limit=10
```

Response headers provide pagination information:

```text
X-Page
X-Limit
X-Total-Count
X-Total-Pages
```

For example:

```text
X-Page: 1
X-Limit: 10
X-Total-Count: 22
X-Total-Pages: 3
```

This allows the application to retrieve records in limited pages instead of requesting thousands of records at once.

## 6. Database

Database:

```text
admissiondb
```

Database server:

```text
PostgreSQL
```

The project includes a database backup:

```text
admissiondb_backup.sql
```

## 7. Database Restore

Create the database:

```sql
CREATE DATABASE admissiondb;
```

Then restore the backup using pgAdmin or PostgreSQL tools.

Backup file:

```text
admissiondb_backup.sql
```

## 8. Running the Backend

Open separate PowerShell terminals for the backend services.

### Terminal 1 — Student Service

```powershell
cd "D:\Admission Management System\Student Service"
go run .
```

Student Service:

```text
http://localhost:8081
```

### Terminal 2 — Admission Service

```powershell
cd "D:\Admission Management System\Admission Service"
go run .
```

Admission Service:

```text
http://localhost:8084
```

### Terminal 3 — Course Service

```powershell
cd "D:\Admission Management System\Course Service"
go run .
```

Course Service:

```text
http://localhost:8085
```

### Terminal 4 — API Gateway

```powershell
cd "D:\Admission Management System\API Gateway"
go run .
```

API Gateway:

```text
http://localhost:8086
```

## 9. Running the React Frontend

Open another terminal:

```powershell
cd "D:\Admission Management System\admission-frontend"
npm install
npm start
```

Then open the frontend URL shown by React in the terminal.

## 10. API Testing

### Students

```text
GET http://localhost:8086/students?page=1&limit=10
```

### Courses

```text
GET http://localhost:8086/courses?page=1&limit=10
```

### Admissions

```text
GET http://localhost:8086/admissions?page=1&limit=10
```

## 11. CORS

The API Gateway is configured to allow requests from the React frontend development ports.

Configured origins include:

```text
http://localhost:3000
http://localhost:3001
http://localhost:3002
http://localhost:3003
```

## 12. Project Features

* Microservices architecture
* REST APIs
* API Gateway
* PostgreSQL database
* React frontend
* CRUD operations
* Pagination
* Request validation
* CORS configuration
* Dashboard
* Course management
* Student management
* Admission management
* Database backup
* Git/GitHub version control

## 13. GitHub Repository

The project source code is maintained in GitHub:

```text
https://github.com/subbachaithanyacse-code/admission-management-system
```

## 14. Project Status

The core Admission Management System is implemented with:

* Student Service
* Course Service
* Admission Service
* API Gateway
* React Frontend
* PostgreSQL Database
* Pagination
* CORS
* Database Backup
* GitHub Repository
s