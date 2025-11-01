# Firestore Collections Structure for Astra

## Collections Overview

### 1. users
Stores user authentication and profile data.

```javascript
users/{userId}
  - name: string
  - email: string
  - role: string (admin, teamlead, member)
  - department: string
  - avatar: string (URL)
  - createdAt: timestamp
```

### 2. clients
Client and company information.

```javascript
clients/{clientId}
  - name: string
  - email: string
  - company: string
  - phone: string
  - project: string
  - status: string (active, inactive, pending)
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 3. projects
Project details and tracking.

```javascript
projects/{projectId}
  - name: string
  - description: string
  - clientId: string (ref to clients)
  - domain: string
  - startDate: timestamp
  - dueDate: timestamp
  - status: string (planning, ongoing, completed)
  - assignedMembers: array[userId]
  - budget: number
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 4. tasks
Task management and assignment.

```javascript
tasks/{taskId}
  - title: string
  - description: string
  - projectId: string (ref to projects)
  - assignedTo: string (userId)
  - assignedBy: string (userId)
  - status: string (pending, in-progress, completed)
  - priority: string (low, medium, high)
  - dueDate: timestamp
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 5. invoices
Billing and payment tracking.

```javascript
invoices/{invoiceId}
  - invoiceNumber: string
  - clientId: string (ref to clients)
  - projectId: string (ref to projects)
  - amount: number
  - status: string (pending, paid, overdue)
  - dueDate: timestamp
  - paidDate: timestamp
  - fileURL: string (PDF in Cloud Storage)
  - createdAt: timestamp
```

### 6. rnd_updates
Research & Development progress tracking.

```javascript
rnd_updates/{updateId}
  - title: string
  - description: string
  - teamMember: string
  - progress: number (0-100)
  - files: array[{url, name, type}]
  - createdAt: timestamp
```

### 7. campaigns
Marketing campaign management.

```javascript
campaigns/{campaignId}
  - name: string
  - platform: string (facebook, instagram, twitter, linkedin, google)
  - status: string (planning, active, paused, completed)
  - budget: string
  - startDate: string
  - endDate: string
  - description: string
  - metrics: object {
      impressions: number
      clicks: number
      conversions: number
    }
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 8. festival_calendar
Festival and event calendar for marketing.

```javascript
festival_calendar/{eventId}
  - name: string
  - date: string
  - description: string
  - category: string (national, religious, cultural, international)
  - createdAt: timestamp
```

### 9. salaries (Future)
Employee salary management.

```javascript
salaries/{salaryId}
  - employeeId: string (userId)
  - basePay: number
  - bonuses: number
  - deductions: number
  - totalPay: number
  - month: string
  - year: number
  - status: string (pending, paid)
  - createdAt: timestamp
```

### 10. notifications (Future)
Real-time notifications system.

```javascript
notifications/{notificationId}
  - userId: string
  - message: string
  - type: string (task, invoice, project, system)
  - read: boolean
  - timestamp: timestamp
```

### 11. teams
Department/team organization.

```javascript
teams/{teamId}
  - name: string (Finance, Client, R&D, Marketing, Management)
  - members: array[userId]
  - leadId: string (userId)
  - description: string
  - createdAt: timestamp
```

## Cloud Storage Structure

```
/invoices/{clientId}/{invoiceId}.pdf
/rnd_updates/{updateId}/{filename}
/salaries/{employeeId}/{month}-{year}.pdf
/reports/{type}/{date}.pdf
/backups/{date}/
```

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Clients collection
    match /clients/{clientId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teamlead'];
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.assignedBy || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teamlead'];
    }
    
    // Invoices collection
    match /invoices/{invoiceId} {
      allow read: if request.auth != null;
      allow create, update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teamlead'];
    }
    
    // All other collections - authenticated users can read, admins can write
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## API Endpoints (Future Backend)

### Auth Service
- POST /api/auth/login
- POST /api/auth/signup
- POST /api/auth/logout
- GET /api/auth/verify

### Task Service
- POST /api/tasks/create
- GET /api/tasks/:userId
- PUT /api/tasks/update/:id
- DELETE /api/tasks/delete/:id
- POST /api/tasks/assign

### Invoice Service
- POST /api/invoice/generate
- GET /api/invoice/:clientId
- GET /api/invoice/download/:id
- PUT /api/invoice/update/:id

### Analytics Service
- GET /api/analytics/dashboard
- GET /api/analytics/revenue
- GET /api/analytics/projects
- GET /api/analytics/tasks

### Notification Service
- POST /api/notify/:userId
- GET /api/notifications/:userId
- PUT /api/notifications/mark-read/:id
