# 🌟 Astra - NXRA Internal Management Web App v3.0

A comprehensive internal management system for NXRA with integrated **Authentication**, **Dashboard Analytics**, **CRM with Auto-Distribution**, **Task Management**, **Finance & Invoicing**, **Teams Management**, **Backend API**, and **Firebase Cloud Functions**. Built with React 19, Firebase, and Express.js.

## ✨ Key Features

### 🔐 Authentication & Role-Based Access
- **Firebase Authentication** with secure login/signup
- **Three role levels**: Admin, Team Lead, Member
- Role-based access control across all modules
- User profile management with department assignment

### 📊 Analytics Dashboard
- **Real-time metrics**: Clients, Projects, Tasks, Revenue
- **Interactive charts**: Revenue trends (LineChart), Project distribution (PieChart)
- **Quick actions**: Create Project, Add Task, Generate Invoice, Add Client
- **Responsive design** with gradient UI and animations

### 🚀 Enhanced CRM with Auto-Distribution
- **Unified project form**: Single submission → Multiple collections
- **Firebase writeBatch**: Atomic operations across clients, projects, invoices, tasks
- **Team member assignment**: Checkbox grid with automatic task creation
- **Auto-distribution info**: Visual confirmation of data distribution
- Complete client CRUD operations

### ✓ Task Management System
- **Comprehensive task UI**: Create, edit, delete, reassign tasks
- **Status management**: Pending → In Progress → Completed
- **View filters**: My Tasks, Assigned by Me, All Tasks (admin)
- **Task reassignment**: One-click reassignment with notifications
- **Priority badges**: High, Medium, Low with color coding
- **Project linking** and **due date tracking**
- Responsive card layout with completion rates

### 💰 Finance & Invoice System with PDF Export
- **Invoice creation** with line items support
- **Client and project linking**
- **Auto-generated invoice numbers** (INV-YYYYMM-XXXX)
- **Tax calculations** (default 18%, customizable)
- **Payment status tracking**: Paid, Pending, Overdue
- **PDF Generation** using jsPDF:
  - Branded NXRA header with gradient
  - Professional invoice layout
  - Line items table with calculations
  - Client and project information
  - Payment status indicator
- **Revenue statistics dashboard**
- Search and filter functionality

### 👥 Teams Module with Department Views
- **Department tabs**: All Teams, Finance, Client Services, R&D, Marketing, Management
- **Team member cards**: Avatars, badges, performance metrics
- **Performance tracking**: Projects, Tasks, Completion rates
- **Department overview stats**
- **Member detail modal**: Contact info, performance metrics, assigned projects, recent tasks
- **Add new members** (admin only)

### 🔬 R&D Tracker Module
- Weekly progress update submission
- File uploads (images, PDFs, documents) to Firebase Storage
- Timeline view of all updates
- Progress tracking with visual indicators

### 📱 Social Media & Marketing Module
- **Campaign Tracker**: Manage marketing campaigns with status tracking
- **Festival Calendar**: Pre-loaded events and festivals
- **Performance Dashboard**: Analytics and metrics visualization
- Multi-platform support (Facebook, Instagram, Twitter, LinkedIn, Google Ads)

### 🖥️ Backend API Layer (Express.js)
- **Authentication**: Firebase Auth integration with JWT
- **7 Route Modules**:
  - `/api/auth` - Register, login, verify token
  - `/api/tasks` - CRUD operations, assignment/reassignment
  - `/api/invoices` - CRUD operations with status tracking
  - `/api/projects` - Project data access
  - `/api/users` - User management (admin only)
  - `/api/analytics` - Dashboard statistics and reports
  - `/api/notifications` - Notification system
- **Security**: Helmet, CORS, JWT authentication
- **Middleware**: Role-based authorization
- **Input validation**: Express-validator
- **Logging**: Morgan for HTTP request logging

### ⚡ Firebase Cloud Functions (Automation)
1. **onProjectCreated**: Auto-generate invoices when projects are created
2. **onTaskCreated**: Send notifications on task assignment
3. **onTaskUpdated**: Notify on reassignment and completion
4. **checkOverdueInvoices**: Daily check and update overdue invoices (00:00)
5. **backupFirestore**: Daily backup of all collections (02:00)
6. **cacheAnalytics**: Pre-calculate dashboard statistics (01:00)
7. **cleanupOldNotifications**: Delete notifications older than 30 days (03:00)

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** with Vite 7.1.12
- **React Router v7.9.5** for navigation
- **Recharts** for data visualization
- **jsPDF** for PDF generation
- **Redux Toolkit** for state management (prepared)
- **date-fns** for date utilities
- Custom CSS with responsive design

### Backend
- **Express.js** - RESTful API
- **Firebase Admin SDK** - Backend Firebase integration
- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP logging
- **CORS** - Cross-origin resource sharing

### Cloud & Database
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Authentication** - User authentication
- **Firebase Analytics** - Usage analytics
- **Firebase Cloud Functions** - Serverless automation

## 📦 Installation

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/nxrainsights-creator/Astra.git
cd Astra
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Frontend runs on: `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install backend dependencies:
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

5. Start the backend server:
```bash
npm run dev
```

6. Backend runs on: `http://localhost:5000`

### Firebase Functions Setup

1. Navigate to functions directory:
```bash
cd functions
```

2. Install function dependencies:
```bash
npm install
```

3. Test locally with emulator:
```bash
npm run serve
```

4. Deploy functions:
```bash
npm run deploy
```

## 📁 Project Structure

```
Astra/
├── src/                                 # Frontend React application
│   ├── components/
│   │   ├── Auth/                       # Login/Signup components
│   │   ├── Dashboard/                  # Analytics dashboard
│   │   ├── NewProject/                 # Unified project form
│   │   ├── TaskManagement/             # Task CRUD and management
│   │   ├── Finance/                    # Invoice management with PDF
│   │   ├── Teams/                      # Team and department views
│   │   ├── ClientCRM/                  # Client management
│   │   ├── RnDTracker/                 # R&D updates
│   │   ├── Marketing/                  # Marketing campaigns
│   │   ├── Management/                 # Management module
│   │   └── Pikachu/                    # AI chatbot assistant
│   ├── firebase/
│   │   ├── config.js                   # Firebase configuration
│   │   ├── services.js                 # Firebase service layer
│   │   └── storage.js                  # Storage operations
│   ├── App.jsx                         # Main app component
│   └── main.jsx                        # React entry point
├── backend/                             # Express.js backend API
│   ├── config/
│   │   └── firebase.js                 # Firebase Admin SDK
│   ├── middleware/
│   │   └── auth.js                     # Authentication middleware
│   ├── routes/                         # API route modules
│   │   ├── auth.js                     # Authentication routes
│   │   ├── tasks.js                    # Task management routes
│   │   ├── invoices.js                 # Invoice routes
│   │   ├── projects.js                 # Project routes
│   │   ├── users.js                    # User management routes
│   │   ├── analytics.js                # Analytics routes
│   │   └── notifications.js            # Notification routes
│   ├── server.js                       # Express server setup
│   ├── package.json                    # Backend dependencies
│   └── README.md                       # Backend documentation
├── functions/                           # Firebase Cloud Functions
│   ├── index.js                        # All cloud functions
│   ├── package.json                    # Functions dependencies
│   └── README.md                       # Functions documentation
├── FIRESTORE_STRUCTURE.md              # Database schema documentation
├── package.json                        # Frontend dependencies
└── README.md                           # This file
```

## 🔥 Firebase Configuration

The project uses Firebase with the following services:
- **Firestore**: Database with 11 collections
- **Storage**: File uploads and attachments
- **Authentication**: User authentication and authorization
- **Analytics**: Usage tracking and insights
- **Cloud Functions**: Automated workflows

## 📊 Firestore Collections

1. **users** - User profiles, roles, departments
2. **clients** - Client information and company details
3. **projects** - Project data with team assignments
4. **tasks** - Task management with status tracking
5. **invoices** - Invoice records with payment status
6. **rnd_updates** - R&D weekly progress updates
7. **campaigns** - Marketing campaign tracking
8. **festival_calendar** - Marketing festival events
9. **salaries** - Salary and payroll information (planned)
10. **notifications** - User notifications
11. **teams** - Department and team structure

## 🎯 Usage Guide

### For Admins
1. **Dashboard**: View company-wide analytics and metrics
2. **Create Projects**: Use unified form to distribute data automatically
3. **Manage Teams**: Add members, assign departments, track performance
4. **Finance**: Generate invoices, track payments, export PDFs
5. **Analytics**: Monitor revenue, tasks, and project completion

### For Team Leads
1. **Assign Tasks**: Create and assign tasks to team members
2. **Track Progress**: Monitor task completion and team performance
3. **Manage Projects**: Update project status and assignments
4. **Review Reports**: Access department-specific analytics

### For Members
1. **View Tasks**: See assigned tasks with priorities and due dates
2. **Update Status**: Mark tasks as in-progress or completed
3. **Submit Updates**: Add R&D weekly progress reports
4. **Track Projects**: View assigned projects and details

## 🚀 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/assign` - Reassign task

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/tasks` - Task statistics

### Notifications
- `POST /api/notifications` - Send notification
- `GET /api/notifications/user/:userId` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

## 🔐 Authentication Flow

1. User registers/logs in with Firebase Authentication
2. Firebase returns ID token
3. Frontend stores token and uses for API calls
4. Backend verifies token with Firebase Admin SDK
5. Backend checks user role from Firestore
6. API responds based on role permissions

## 🚀 Build for Production

### Frontend
```bash
npm run build
```
Output: `dist/` directory

### Backend
```bash
cd backend
npm start
```

### Functions
```bash
cd functions
npm run deploy
```

## 📝 Development Workflow

1. **Feature Development**: Work in `src/components/`
2. **API Development**: Add routes in `backend/routes/`
3. **Automation**: Add functions in `functions/index.js`
4. **Testing**: Test locally with dev server and emulators
5. **Deployment**: Build frontend, deploy backend and functions

## 🔒 Security Features

- Firebase Authentication with secure token verification
- Role-based access control (RBAC)
- JWT token authentication for API
- CORS configuration
- Helmet for security headers
- Input validation with express-validator
- Firebase Security Rules (Firestore)

## 📈 Performance Optimizations

- Cached analytics (updated daily)
- Firebase writeBatch for atomic operations
- Lazy loading components
- Optimized Firebase queries with indexing
- Compressed API responses (gzip)
- CDN delivery for static assets

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

### Functions Testing
```bash
cd functions
npm run serve
```

## 📄 License

ISC

## 👨‍💻 Contributors

**Lead Developer**: Sanjai
- Client & CRM Module
- R&D Tracker
- Marketing Module
- Full System Architecture

**Tech Stack**:
- React 19 + Vite
- Firebase (Firestore, Auth, Storage, Functions)
- Express.js Backend
- jsPDF, Recharts, Redux Toolkit

---

Built with ❤️ for NXRA Insights | Version 3.0 | October 2025
