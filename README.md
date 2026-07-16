# ICHgram Frontend

Frontend part of the ICHgram social network application.

The application provides authentication, a post feed, user profiles, search, Explore, notifications, messages, comments and likes.

## Technologies

- React
- Vite
- React Router
- Axios
- CSS
- Docker

## Features

- User registration and login
- JWT authentication
- Feed with posts
- Create and edit posts
- Likes and comments
- Current user profile
- Other user profiles
- User search
- Explore gallery
- Notifications
- Messages interface
- Responsive interface

## Full project

The recommended way to start the complete application is through the fullstack repository:

```bash
git clone --recurse-submodules https://github.com/zabyz1337/ichgram-fullstack.git
cd ichgram-fullstack
docker compose up -d --build
```

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

No manual environment configuration is required when using the fullstack Docker setup.

## Run frontend separately

### Requirements

- Node.js
- npm
- Running ICHgram backend on port `5000`

### Installation

```bash
git clone https://github.com/zabyz1337/ichgram-frontend.git
cd ichgram-frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Docker

Build the frontend image:

```bash
docker build -t ichgram-frontend .
```

Run the container:

```bash
docker run --rm -p 5173:5173 ichgram-frontend
```

For the complete application with MongoDB and backend, use the `ichgram-fullstack` repository.


## Related repositories

- Frontend: `zabyz1337/ichgram-frontend`
- Backend: `zabyz1337/ichgram-backend`
- Fullstack Docker setup: `zabyz1337/ichgram-fullstack`