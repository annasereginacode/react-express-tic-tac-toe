# Full-Stack Tic-Tac-Toe with Authentication

A full-stack Tic-Tac-Toe application built with React, Vite, Express, JWT authentication, and JSON file persistence.

Users can create accounts, log in, and maintain their own saved game state across sessions. Each user's game progress is stored separately and automatically restored when they return.

## Features

- User registration
- User login and logout
- JWT-based authentication using HTTP-only cookies
- Persistent user accounts stored in a JSON file
- Individual game state for each user
- Tic-Tac-Toe gameplay
- Move history and time travel
- Winner detection
- Draw detection
- Reset game button
- Automatic game state saving
- Automatic game state restoration after page refresh
- Login state persists across browser refreshes

## Project Structure

```text
project/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── index.js
│   ├── users-data.json
│   └── package.json
│
└── README.md
```

## Technologies Used

- React
- Vite
- Express
- JavaScript
- JWT (JSON Web Tokens)
- bcrypt
- Cookie Parser
- JSON File Storage

## Running the Application Locally

### Start the Server

Open a terminal in the `server` folder:

```bash
npm install
node index.js
```

The server will start on:

```text
http://localhost:3000
```

### Start the Client

Open a second terminal in the `client` folder:

```bash
npm install
npm run dev
```

The client will start on:

```text
http://localhost:5173
```

### Open the Application

Open the following URL in your browser:

```text
http://localhost:5173
```

## How It Works

### Registration

- Users create an account with an email and password.
- Passwords are hashed using bcrypt before being stored.
- A new game state is created for each registered user.
- Users are automatically logged in after registration.

### Authentication

- JWT tokens are generated after successful login.
- Tokens are stored in HTTP-only cookies.
- Protected routes require authentication before accessing user data.

### Game Persistence

Each user has their own game state:

```json
{
  "email": "user@example.com",
  "password": "hashed-password",
  "gameData": {
    "history": [
      [null, null, null, null, null, null, null, null, null]
    ],
    "currentMove": 0
  }
}
```

Game progress is automatically saved after every move and restored when the user returns.

## Future Improvements

- Password reset functionality
- User profile management
- Database storage (MongoDB, PostgreSQL, etc.)
- Online multiplayer support
- Game statistics and leaderboards
- Improved UI and responsive design

## Author

Created by Anna Seregina as a portfolio project demonstrating React, Express, JWT authentication, password hashing, and server-side data persistence.