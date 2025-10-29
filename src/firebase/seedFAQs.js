// Seed script to populate initial FAQ data for Pikachu chatbot
// Run this once to set up the knowledge base

import { chatbotService } from './src/firebase/services.js';

const initialFAQs = [
  {
    question: 'How do I create an invoice?',
    answer: '📄 To create an invoice: 1) Go to Finance → Invoices, 2) Click "Generate Invoice", 3) Fill in client details (or select existing client), 4) Add items with quantities and rates, 5) Add tax if needed, 6) Click "Generate Invoice". The system will auto-fetch client details from CRM if you have them!',
    category: 'Finance',
    module: 'finance',
    keywords: ['invoice', 'generate', 'billing', 'create invoice', 'bill']
  },
  {
    question: 'How do I view billing dashboard?',
    answer: '💰 To view the billing dashboard: Go to Finance → Dashboard. You\'ll see total revenue, pending amounts, invoice statistics, and recent transactions. All data is updated in real-time from Firebase!',
    category: 'Finance',
    module: 'finance',
    keywords: ['billing', 'dashboard', 'revenue', 'finance dashboard', 'money']
  },
  {
    question: 'How do I assign a task?',
    answer: '✅ To assign a task: 1) Navigate to Management → Task Management, 2) Click "Create Task", 3) Fill in task details (title, description, department), 4) Set priority and due date, 5) Click "Create Task". The task will appear in the dashboard immediately!',
    category: 'Management',
    module: 'management',
    keywords: ['task', 'assign', 'create task', 'todo', 'assignment']
  },
  {
    question: 'Where is the KPI dashboard?',
    answer: '📊 The KPI Dashboard is located in Management → KPI Dashboard. Here you can view overall performance metrics, department-wise statistics, task completion rates, and team productivity insights!',
    category: 'Management',
    module: 'management',
    keywords: ['kpi', 'performance', 'dashboard', 'metrics', 'statistics']
  },
  {
    question: 'How do I add a new client?',
    answer: '👥 To add a new client: 1) Go to Client & CRM section, 2) Click "Add Client", 3) Fill in client information (name, email, company, etc.), 4) Click "Save Client". The client will be available for invoicing immediately!',
    category: 'CRM',
    module: 'crm',
    keywords: ['client', 'add client', 'crm', 'customer', 'new client']
  },
  {
    question: 'How do I submit R&D updates?',
    answer: '🔬 To submit R&D updates: 1) Go to R&D Tracker, 2) Click "Add Update", 3) Fill in your weekly progress, challenges, and next steps, 4) Upload any relevant documents, 5) Submit. Your team can view all updates in the tracker!',
    category: 'R&D',
    module: 'rnd',
    keywords: ['rnd', 'research', 'update', 'weekly update', 'progress']
  },
  {
    question: 'How do I create a marketing campaign?',
    answer: '📢 To create a marketing campaign: 1) Navigate to Marketing section, 2) Click "Create Campaign", 3) Add campaign details (name, target audience, budget), 4) Set start and end dates, 5) Save Campaign. Track all campaigns in the marketing dashboard!',
    category: 'Marketing',
    module: 'marketing',
    keywords: ['marketing', 'campaign', 'create campaign', 'promotion', 'advertising']
  },
  {
    question: 'How do I manage the festival calendar?',
    answer: '🎉 To manage the festival calendar: Go to Marketing → Festival Calendar. You can add upcoming festivals, plan campaigns around them, and schedule social media posts accordingly!',
    category: 'Marketing',
    module: 'marketing',
    keywords: ['festival', 'calendar', 'events', 'holidays', 'schedule']
  },
  {
    question: 'How do I check salary reports?',
    answer: '💵 To check salary reports: Go to Finance → Salary. Here you can view salary allocations, calculate pay based on task logs, and generate payroll reports for each month!',
    category: 'Finance',
    module: 'finance',
    keywords: ['salary', 'payroll', 'pay', 'compensation', 'wages']
  },
  {
    question: 'How do I monitor department progress?',
    answer: '📈 To monitor department progress: Visit Management → KPI Dashboard. You\'ll see each department\'s task completion rate, pending tasks, overdue items, and overall performance metrics!',
    category: 'Management',
    module: 'management',
    keywords: ['department', 'progress', 'monitoring', 'team', 'performance']
  },
  {
    question: 'What can Pikachu help me with?',
    answer: '⚡ Pika! I can help you with: Creating invoices, Managing tasks, Adding clients, R&D updates, Marketing campaigns, Checking KPIs, Salary information, and navigating the NXRA Portal. Just ask me anything!',
    category: 'General',
    module: 'general',
    keywords: ['pikachu', 'help', 'what', 'can do', 'features']
  },
  {
    question: 'How do I navigate the portal?',
    answer: '🧭 Use the sidebar on the left to navigate between modules: Client & CRM, R&D Tracker, Marketing, Finance, and Management. Each section has its own dashboard and features. Click on any module to get started!',
    category: 'General',
    module: 'general',
    keywords: ['navigate', 'navigation', 'menu', 'sidebar', 'how to use']
  }
];

async function seedFAQs() {
  console.log('🌱 Starting to seed FAQ data for Pikachu chatbot...');
  
  try {
    for (const faq of initialFAQs) {
      await chatbotService.addFAQ(faq);
      console.log(`✅ Added FAQ: ${faq.question}`);
    }
    
    console.log('🎉 Successfully seeded all FAQs!');
    console.log(`Total FAQs added: ${initialFAQs.length}`);
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
  }
}

// Uncomment to run the seed function
// seedFAQs();

export { seedFAQs, initialFAQs };
