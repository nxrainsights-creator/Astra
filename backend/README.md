# Astra Backend API

Backend microservices API for NXRA Astra Internal Management System.

## 🚀 Features

- **Authentication**: Firebase Auth integration with JWT
- **Task Management**: CRUD operations for tasks with assignment
- **Invoice Management**: Invoice generation and tracking
- **Project Management**: Project data access
- **User Management**: User profile and role management
- **Analytics**: Dashboard statistics and reports
- **Notifications**: Real-time notification system

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase Admin SDK credentials
- Firebase project setup

## 🔧 Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

## 🏃 Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify` - Verify JWT token
- `POST /refresh` - Refresh token

### Tasks (`/api/tasks`)
- `GET /` - Get all tasks (with filters)
- `GET /:id` - Get task by ID
- `POST /` - Create new task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task (admin/teamlead only)
- `PATCH /:id/assign` - Assign/reassign task

### Invoices (`/api/invoices`)
- `GET /` - Get all invoices
- `GET /:id` - Get invoice by ID
- `POST /` - Create invoice
- `PUT /:id` - Update invoice
- `DELETE /:id` - Delete invoice (admin only)

### Projects (`/api/projects`)
- `GET /` - Get all projects
- `GET /:id` - Get project by ID

### Users (`/api/users`)
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user (admin only)

### Analytics (`/api/analytics`)
- `GET /dashboard` - Get dashboard statistics
- `GET /revenue` - Get revenue analytics
- `GET /tasks` - Get task statistics

### Notifications (`/api/notifications`)
- `POST /` - Send notification
- `GET /user/:userId` - Get user notifications
- `PATCH /:id/read` - Mark as read
- `PATCH /user/:userId/read-all` - Mark all as read

## 🔐 Authentication

All API endpoints (except `/health` and `/api/auth/*`) require authentication using Firebase ID tokens.

Include token in request headers:
```
Authorization: Bearer <firebase_id_token>
```

## 🛡️ Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Team Lead**: Access to most endpoints, can delete tasks
- **Member**: Limited access, can view and update assigned tasks

## 📦 Project Structure

```
backend/
├── config/
│   └── firebase.js         # Firebase Admin SDK configuration
├── middleware/
│   └── auth.js             # Authentication & authorization middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── tasks.js            # Task management routes
│   ├── invoices.js         # Invoice routes
│   ├── projects.js         # Project routes
│   ├── users.js            # User management routes
│   ├── analytics.js        # Analytics routes
│   └── notifications.js    # Notification routes
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── server.js               # Express server setup
└── README.md               # This file
```

## 🧪 Testing

Health check endpoint:
```bash
curl http://localhost:5000/health
```

## 🚀 Deployment

### Option 1: Firebase Functions
Deploy as Firebase Cloud Functions for serverless architecture.

### Option 2: Traditional Hosting
Deploy to services like Heroku, AWS EC2, or DigitalOcean.

## 📝 Notes

- Ensure Firebase Admin SDK credentials are properly configured
- Use HTTPS in production
- Implement rate limiting for production
- Set up proper error logging and monitoring
- Keep dependencies updated

## 🔗 Related

- Frontend: `../src` (React application)
- Firebase Console: https://console.firebase.google.com

## 📄 License

MIT
