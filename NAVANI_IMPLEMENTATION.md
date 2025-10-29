# Navani's Module Implementation - NXRA Portal

## 🎯 Overview
This implementation includes three main modules as per Navani's responsibilities:
1. **Finance System** - Invoice generation, billing dashboard, and salary allocation
2. **Management Panel** - Task assignment, department monitoring, and KPI tracking
3. **Pikachu Chatbot** - AI assistant with Firebase-powered knowledge base

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Finance/
│   │   ├── Finance.jsx          # Main finance component
│   │   └── Finance.css          # Finance styling
│   ├── Management/
│   │   ├── Management.jsx       # Task and KPI management
│   │   └── Management.css       # Management styling
│   └── Pikachu/
│       ├── Pikachu.jsx          # Chatbot component
│       └── Pikachu.css          # Chatbot styling
├── firebase/
│   ├── config.js                # Firebase configuration
│   ├── services.js              # All Firebase service functions
│   ├── storage.js               # File storage services
│   └── seedFAQs.js              # FAQ seeding script
└── App.jsx                      # Main app with routing
```

---

## 💰 Finance System

### Features Implemented:
- ✅ **Invoice Generator**
  - Auto-fetches client details from CRM
  - Dynamic item addition with automatic calculations
  - Tax percentage configuration
  - Invoice number auto-generation
  - Due date tracking

- ✅ **Billing Dashboard**
  - Total revenue tracking
  - Pending amounts overview
  - Invoice statistics (total, paid, pending, overdue)
  - Recent invoices list

- ✅ **Salary Allocation System**
  - Calculate salary based on task logs
  - Track bonuses and deductions
  - Monthly salary reports
  - Performance-based calculations

### Firebase Collections:
- `invoices` - Stores all invoice data
- `salaries` - Stores salary allocation records

### Usage:
```javascript
// Generate an invoice
import { financeService } from './firebase/services';

const invoice = await financeService.generateInvoice({
  clientId: 'client123',
  items: [
    { description: 'Service', quantity: 2, rate: 500, amount: 1000 }
  ],
  tax: 10,
  dueDate: '2025-12-31'
});

// Get billing dashboard
const dashboard = await financeService.getBillingDashboard();
```

---

## 📊 Management Panel

### Features Implemented:
- ✅ **Task Assignment Dashboard**
  - Full CRUD operations (Create, Read, Update, Delete)
  - Real-time Firebase synchronization
  - Task status tracking (Pending, In Progress, Completed, On Hold)
  - Priority levels (Low, Medium, High, Urgent)
  - Department-wise task organization
  - Due date management

- ✅ **Department Monitoring**
  - View tasks by department
  - Track department performance
  - Monitor overdue tasks
  - Real-time progress updates

- ✅ **KPI Dashboard**
  - Overall completion rates
  - Department-wise breakdown
  - Task statistics
  - Performance metrics
  - Visual progress bars

### Firebase Collections:
- `tasks` - Stores all task assignments and details

### Usage:
```javascript
// Create a task
import { managementService } from './firebase/services';

const task = await managementService.createTask({
  title: 'Design Homepage',
  description: 'Create responsive homepage design',
  department: 'Development',
  priority: 'high',
  status: 'pending',
  dueDate: '2025-11-15',
  estimatedHours: 8
});

// Get KPIs
const kpis = await managementService.getOverallKPIs();
```

---

## ⚡ Pikachu Chatbot

### Features Implemented:
- ✅ **Floating Chat Widget**
  - Always accessible on all pages
  - Smooth animations
  - Collapsible interface
  - Mobile responsive

- ✅ **Firebase Knowledge Base**
  - FAQ storage in Firestore
  - Keyword-based search
  - Category organization
  - Module-specific responses

- ✅ **Smart Query Handling**
  - Keyword matching
  - Context-aware responses
  - Quick question suggestions
  - Fallback responses

- ✅ **Chat History**
  - Saves all conversations
  - User session tracking
  - Analytics support

### Firebase Collections:
- `chatbot_faqs` - Knowledge base with questions, answers, and keywords
- `chat_history` - Stores all chat interactions

### Usage:
```javascript
// Add FAQ to knowledge base
import { chatbotService } from './firebase/services';

await chatbotService.addFAQ({
  question: 'How do I create an invoice?',
  answer: 'Go to Finance → Invoices → Generate Invoice...',
  category: 'Finance',
  module: 'finance',
  keywords: ['invoice', 'generate', 'billing']
});

// Search FAQs
const results = await chatbotService.searchFAQs('how to create invoice');
```

---

## 🚀 Setup Instructions

### 1. Firebase Configuration
The Firebase configuration is already set up in `src/firebase/config.js` using the credentials from `info.txt`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBLogsJmDhAbBYWAaa9RFg4Vd0gyiT81iA",
  authDomain: "nxra-portal.firebaseapp.com",
  projectId: "nxra-portal",
  storageBucket: "nxra-portal.firebasestorage.app",
  messagingSenderId: "1084781179957",
  appId: "1:1084781179957:web:d45e5c46fd90f719286d7c",
  measurementId: "G-VKKXZ67TNX"
};
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Initial FAQ Data
To populate the chatbot knowledge base:

```javascript
// In src/firebase/seedFAQs.js, uncomment the last line:
seedFAQs();

// Then run the app once to execute the seed function
npm run dev
```

### 4. Run the Application
```bash
npm run dev
```

---

## 🎨 Key Features

### Finance Module:
- **Invoice Generation**: Automatically fetches client data from CRM
- **Billing Reports**: Real-time revenue and payment tracking
- **PDF Export**: Ready for Firebase Storage integration
- **Tax Calculations**: Automatic tax computation

### Management Module:
- **Task CRUD**: Complete task lifecycle management
- **Department KPIs**: Performance tracking per department
- **Progress Monitoring**: Visual completion rates
- **Overdue Alerts**: Automatic overdue task detection

### Pikachu Chatbot:
- **Always Available**: Floating widget on every page
- **Smart Responses**: Context-aware FAQ matching
- **Multi-Module Support**: Covers all portal features
- **Chat History**: Tracks all user interactions

---

## 📊 Firebase Firestore Structure

### Collections:

#### `invoices`
```javascript
{
  invoiceNumber: "INV-1234567890",
  clientId: "client123",
  clientName: "John Doe",
  clientEmail: "john@example.com",
  clientCompany: "ABC Corp",
  items: [
    { description: "Service", quantity: 2, rate: 500, amount: 1000 }
  ],
  subtotal: 1000,
  tax: 10,
  total: 1100,
  status: "pending",
  dueDate: "2025-12-31",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `tasks`
```javascript
{
  title: "Design Homepage",
  description: "Create responsive homepage design",
  assignedTo: ["user1", "user2"],
  department: "Development",
  priority: "high",
  status: "in-progress",
  dueDate: "2025-11-15",
  estimatedHours: 8,
  actualHours: 0,
  tags: ["design", "frontend"],
  createdBy: "manager1",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `chatbot_faqs`
```javascript
{
  question: "How do I create an invoice?",
  answer: "Go to Finance → Invoices → Generate Invoice...",
  category: "Finance",
  module: "finance",
  keywords: ["invoice", "generate", "billing"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `chat_history`
```javascript
{
  userId: "user123",
  message: "How do I create an invoice?",
  response: "Go to Finance → Invoices...",
  helpful: true,
  sessionId: "session123",
  timestamp: Timestamp
}
```

#### `salaries`
```javascript
{
  employeeId: "emp123",
  employeeName: "Jane Doe",
  baseSalary: 5000,
  bonuses: 500,
  deductions: 200,
  totalHours: 160,
  taskCompletions: 25,
  performanceRating: 4.5,
  netSalary: 5300,
  month: 11,
  year: 2025,
  status: "pending",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔗 Integration Points

### With Sanjai's Modules:
- **Client CRM** ↔ **Finance**: Auto-fetch client details for invoices
- **Task Management** ↔ **Salary**: Calculate pay based on completed tasks
- **All Modules** ↔ **Pikachu**: Chatbot provides help for all features

---

## 🎯 Testing Checklist

### Finance Module:
- [ ] Create invoice with new client details
- [ ] Create invoice using existing client from CRM
- [ ] Add multiple items to invoice
- [ ] Calculate tax correctly
- [ ] View billing dashboard statistics
- [ ] Mark invoice as paid
- [ ] Check overdue invoices

### Management Module:
- [ ] Create new task
- [ ] Edit existing task
- [ ] Delete task
- [ ] Update task status
- [ ] Filter tasks by department
- [ ] View department KPIs
- [ ] Check overall KPI dashboard
- [ ] Verify overdue task detection

### Pikachu Chatbot:
- [ ] Open/close chat widget
- [ ] Send messages and receive responses
- [ ] Test quick questions
- [ ] Try different query types
- [ ] Verify FAQ matching
- [ ] Check chat history saving
- [ ] Test on different pages
- [ ] Verify mobile responsiveness

---

## 🚀 Next Steps

### Future Enhancements:
1. **Finance**:
   - PDF invoice generation with Firebase Storage
   - Email invoice to clients
   - Payment gateway integration
   - Recurring invoices

2. **Management**:
   - Gantt chart for tasks
   - Team collaboration features
   - Time tracking integration
   - Email notifications for deadlines

3. **Pikachu**:
   - Natural Language Processing (NLP)
   - Voice input/output
   - Multi-language support
   - Integration with external APIs

---

## 📝 Notes

- All Firebase operations are real-time
- Data is automatically synced across all users
- Error handling is implemented for all API calls
- The chatbot can be extended with more FAQs
- Mobile responsive design is implemented

---

## 👥 Credits

**Implemented by**: Navani A.
**Project**: NXRA Portal
**Modules**: Finance, Management, Pikachu Chatbot
**Framework**: React + Firebase
**Date**: October 2025

---

## 📞 Support

For issues or questions about these modules:
1. Check the Pikachu chatbot first
2. Review this documentation
3. Check Firebase console for data
4. Review browser console for errors

**Happy Coding! ⚡ Pika Pika!**
