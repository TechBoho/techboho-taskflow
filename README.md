# TechBoho TaskFlow

A full-stack task management application designed to help users create, organize, track, and analyse their tasks through a modern dashboard.

TechBoho TaskFlow demonstrates full-stack web development using React, Node.js, Express.js, MongoDB, JWT authentication, REST APIs, and data visualisation.

## Features

- User registration and login
- JWT-based authentication
- User-specific task management
- Create, read, update, and delete tasks
- Task priority levels
- Task categories
  - Work
  - Trading
  - Fitness
  - Personal
  - Learning
- Due-date management
- Task status tracking
  - Pending
  - In Progress
  - Completed
- Search tasks by title
- Sort tasks by priority, due date, and status
- Filter tasks by category
- Task statistics dashboard
- Task completion progress tracking
- Task status pie chart
- Category analytics bar chart
- Persistent task data using MongoDB

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman
- MongoDB Atlas

## Application Architecture

```text
React Frontend
      |
      | HTTP / REST API
      v
Node.js + Express.js
      |
      | Mongoose
      v
MongoDB Atlas
```

## Authentication & Security

TechBoho TaskFlow uses JWT-based authentication.

Protected API routes require a valid authentication token, and task operations are associated with the authenticated user. This prevents users from modifying or deleting tasks belonging to another account.

Passwords are hashed before being stored in the database.

## Task Analytics

The dashboard provides real-time task analytics, including:

- Total tasks
- Pending tasks
- Tasks in progress
- Completed tasks
- Completion percentage
- Task status distribution
- Tasks grouped by category

Charts automatically update when task data changes.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/TechBoho/techboho-taskflow.git
cd techboho-taskflow
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit your real `.env` file, database credentials, or JWT secret to GitHub.

## Running the Application

### Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend runs locally on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal and run:

```bash
cd client
npm run dev
```

Vite will display the local development URL, typically:

```text
http://localhost:5173
```

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Tasks

The application provides protected REST API operations for creating, retrieving, updating, and deleting user tasks.

## Testing

The application has been manually tested for:

- Registration
- Login and logout
- Invalid login credentials
- Duplicate user registration
- Required task fields
- Creating tasks
- Editing tasks
- Deleting tasks
- Task status changes
- Searching
- Sorting
- Category filtering
- Statistics updates
- Progress tracking
- Analytics chart updates
- Data persistence after logout and login

## Screenshots

Application screenshots will be added after final deployment preparation.

## Live Demo

Deployment link coming soon.

## Future Improvements

Potential future improvements may include additional productivity and collaboration functionality.

The current version focuses on secure authentication, task management, filtering, progress tracking, and analytics.

## Author

**Teboho Lebia**

Full-Stack Developer

GitHub: **TechBoho**

## Project Status

**Core development and functional testing complete.**

The project is currently being prepared for deployment and portfolio presentation.