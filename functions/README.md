# Firebase Cloud Functions - Astra

Automated serverless functions for NXRA Astra Internal Management System.

## 🎯 Functions Overview

### 1. **onProjectCreated** (Firestore Trigger)
- **Trigger**: When a new project is created
- **Action**: Automatically generates an invoice for the project
- **Details**: Creates invoice with project budget, 18% tax, pending status

### 2. **onTaskCreated** (Firestore Trigger)
- **Trigger**: When a new task is created
- **Action**: Sends notification to assigned user
- **Details**: Notifies team member about new task assignment

### 3. **onTaskUpdated** (Firestore Trigger)
- **Trigger**: When a task is updated
- **Actions**:
  - Sends notification when task is reassigned
  - Notifies task assigner when task is completed
- **Details**: Tracks status changes and reassignments

### 4. **checkOverdueInvoices** (Scheduled - Daily 00:00)
- **Schedule**: Every day at midnight
- **Action**: Updates invoice status from 'pending' to 'overdue'
- **Details**: Checks all pending invoices against due dates

### 5. **backupFirestore** (Scheduled - Daily 02:00)
- **Schedule**: Every day at 2:00 AM
- **Action**: Creates backup of all Firestore collections
- **Details**: Backs up users, clients, projects, tasks, invoices, notifications

### 6. **cacheAnalytics** (Scheduled - Daily 01:00)
- **Schedule**: Every day at 1:00 AM
- **Action**: Pre-calculates and caches dashboard analytics
- **Details**: Improves dashboard load performance

### 7. **cleanupOldNotifications** (Scheduled - Daily 03:00)
- **Schedule**: Every day at 3:00 AM
- **Action**: Deletes notifications older than 30 days
- **Details**: Maintains database cleanliness

## 📦 Installation

1. Navigate to functions directory:
```bash
cd functions
```

2. Install dependencies:
```bash
npm install
```

## 🧪 Local Testing

Run functions emulator:
```bash
npm run serve
```

Test functions locally:
```bash
npm run shell
```

## 🚀 Deployment

Deploy all functions:
```bash
npm run deploy
```

Deploy specific function:
```bash
firebase deploy --only functions:onProjectCreated
```

## 📊 Monitoring

View function logs:
```bash
npm run logs
```

View specific function logs:
```bash
firebase functions:log --only onProjectCreated
```

## 🔧 Configuration

Functions are configured in `firebase.json`:
```json
{
  "functions": {
    "source": "functions"
  }
}
```

## 🔐 Security

- All functions use Firebase Admin SDK with elevated privileges
- Ensure proper IAM roles are configured
- Never expose service account keys in client code

## 📝 Function Details

### Firestore Triggers
- **Path Pattern**: `collection/{documentId}`
- **Events**: onCreate, onUpdate, onDelete, onWrite
- **Context**: Includes document data and metadata

### Scheduled Functions
- **Timezone**: UTC by default
- **Cron Format**: Standard cron expressions
- **Retry**: Automatic retry on failure

## 🎯 Best Practices

1. **Idempotency**: Functions should be idempotent (safe to run multiple times)
2. **Timeouts**: Keep function execution under 60 seconds
3. **Error Handling**: Always wrap in try-catch blocks
4. **Logging**: Use console.log for debugging
5. **Testing**: Test locally before deploying

## 📈 Performance

- Functions auto-scale based on load
- Cold start time: ~1-2 seconds
- Warm execution: <100ms typically

## 💰 Costs

Firebase Cloud Functions pricing based on:
- Invocation count
- Compute time (GB-seconds)
- Network egress

Free tier includes:
- 2M invocations/month
- 400,000 GB-seconds
- 200,000 CPU-seconds

## 🔗 Related

- Frontend: `../src`
- Backend API: `../backend`
- Firebase Console: https://console.firebase.google.com

## 📄 License

MIT
