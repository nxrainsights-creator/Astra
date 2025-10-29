import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Client Services
export const clientService = {
  // Create new client
  async createClient(clientData) {
    try {
      const docRef = await addDoc(collection(db, 'clients'), {
        ...clientData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...clientData };
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Get all clients
  async getAllClients() {
    try {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  },

  // Get client by ID
  async getClientById(id) {
    try {
      const docRef = doc(db, 'clients', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting client:', error);
      throw error;
    }
  },

  // Update client
  async updateClient(id, clientData) {
    try {
      const docRef = doc(db, 'clients', id);
      await updateDoc(docRef, {
        ...clientData,
        updatedAt: Timestamp.now()
      });
      return { id, ...clientData };
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client
  async deleteClient(id) {
    try {
      await deleteDoc(doc(db, 'clients', id));
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Search clients
  async searchClients(searchTerm) {
    try {
      const clients = await this.getAllClients();
      return clients.filter(client => 
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching clients:', error);
      throw error;
    }
  }
};

// R&D Services
export const rndService = {
  // Create weekly update
  async createUpdate(updateData) {
    try {
      const docRef = await addDoc(collection(db, 'rnd_updates'), {
        ...updateData,
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...updateData };
    } catch (error) {
      console.error('Error creating R&D update:', error);
      throw error;
    }
  },

  // Get all updates
  async getAllUpdates() {
    try {
      const q = query(collection(db, 'rnd_updates'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting R&D updates:', error);
      throw error;
    }
  },

  // Get updates by week
  async getUpdatesByWeek(startDate, endDate) {
    try {
      const q = query(
        collection(db, 'rnd_updates'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting weekly updates:', error);
      throw error;
    }
  }
};

// Marketing Services
export const marketingService = {
  // Create campaign
  async createCampaign(campaignData) {
    try {
      const docRef = await addDoc(collection(db, 'campaigns'), {
        ...campaignData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...campaignData };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Get all campaigns
  async getAllCampaigns() {
    try {
      const querySnapshot = await getDocs(collection(db, 'campaigns'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting campaigns:', error);
      throw error;
    }
  },

  // Update campaign
  async updateCampaign(id, campaignData) {
    try {
      const docRef = doc(db, 'campaigns', id);
      await updateDoc(docRef, {
        ...campaignData,
        updatedAt: Timestamp.now()
      });
      return { id, ...campaignData };
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  // Get festival calendar
  async getFestivalCalendar() {
    try {
      const querySnapshot = await getDocs(collection(db, 'festival_calendar'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting festival calendar:', error);
      throw error;
    }
  },

  // Add festival event
  async addFestivalEvent(eventData) {
    try {
      const docRef = await addDoc(collection(db, 'festival_calendar'), {
        ...eventData,
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...eventData };
    } catch (error) {
      console.error('Error adding festival event:', error);
      throw error;
    }
  }
};

// Finance Services (Navani's Module)
export const financeService = {
  // Generate Invoice - Auto-fetch client details from CRM
  async generateInvoice(invoiceData) {
    try {
      // Fetch client details if clientId is provided
      let clientDetails = null;
      if (invoiceData.clientId) {
        clientDetails = await clientService.getClientById(invoiceData.clientId);
      }

      const invoice = {
        invoiceNumber: `INV-${Date.now()}`,
        clientId: invoiceData.clientId,
        clientName: clientDetails?.name || invoiceData.clientName,
        clientEmail: clientDetails?.email || invoiceData.clientEmail,
        clientCompany: clientDetails?.company || invoiceData.clientCompany,
        items: invoiceData.items || [],
        subtotal: invoiceData.subtotal || 0,
        tax: invoiceData.tax || 0,
        total: invoiceData.total || 0,
        status: invoiceData.status || 'pending',
        dueDate: invoiceData.dueDate,
        notes: invoiceData.notes || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'invoices'), invoice);
      return { id: docRef.id, ...invoice };
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  },

  // Get all invoices
  async getAllInvoices() {
    try {
      const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID
  async getInvoiceById(id) {
    try {
      const docRef = doc(db, 'invoices', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw error;
    }
  },

  // Update invoice status
  async updateInvoiceStatus(id, status) {
    try {
      const docRef = doc(db, 'invoices', id);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  // Get billing dashboard data
  async getBillingDashboard() {
    try {
      const invoices = await this.getAllInvoices();
      
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0);
      
      const pendingAmount = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.total, 0);
      
      const overdueInvoices = invoices.filter(inv => {
        if (inv.status === 'pending' && inv.dueDate) {
          const dueDate = inv.dueDate.toDate ? inv.dueDate.toDate() : new Date(inv.dueDate);
          return dueDate < new Date();
        }
        return false;
      });

      return {
        totalRevenue,
        pendingAmount,
        totalInvoices: invoices.length,
        paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
        pendingInvoices: invoices.filter(inv => inv.status === 'pending').length,
        overdueInvoices: overdueInvoices.length,
        recentInvoices: invoices.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting billing dashboard:', error);
      throw error;
    }
  },

  // Salary Allocation System
  async calculateSalary(salaryData) {
    try {
      const salary = {
        employeeId: salaryData.employeeId,
        employeeName: salaryData.employeeName,
        baseSalary: salaryData.baseSalary || 0,
        bonuses: salaryData.bonuses || 0,
        deductions: salaryData.deductions || 0,
        totalHours: salaryData.totalHours || 0,
        taskCompletions: salaryData.taskCompletions || 0,
        performanceRating: salaryData.performanceRating || 0,
        netSalary: (salaryData.baseSalary || 0) + (salaryData.bonuses || 0) - (salaryData.deductions || 0),
        month: salaryData.month,
        year: salaryData.year,
        status: salaryData.status || 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'salaries'), salary);
      return { id: docRef.id, ...salary };
    } catch (error) {
      console.error('Error calculating salary:', error);
      throw error;
    }
  },

  // Get salary reports
  async getSalaryReports(month, year) {
    try {
      let q = collection(db, 'salaries');
      
      if (month && year) {
        q = query(q, 
          where('month', '==', month),
          where('year', '==', year)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting salary reports:', error);
      throw error;
    }
  },

  // Save invoice PDF reference to Firestore
  async saveInvoicePDF(invoiceId, pdfData) {
    try {
      const docRef = doc(db, 'invoices', invoiceId);
      await updateDoc(docRef, {
        pdfUrl: pdfData.url,
        pdfPath: pdfData.path,
        pdfGeneratedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error saving invoice PDF:', error);
      throw error;
    }
  }
};

// Management Services (Navani's Module)
export const managementService = {
  // Task Assignment - CRUD Operations
  async createTask(taskData) {
    try {
      const task = {
        title: taskData.title,
        description: taskData.description || '',
        assignedTo: taskData.assignedTo || [],
        department: taskData.department || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        dueDate: taskData.dueDate,
        estimatedHours: taskData.estimatedHours || 0,
        actualHours: taskData.actualHours || 0,
        tags: taskData.tags || [],
        createdBy: taskData.createdBy || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'tasks'), task);
      return { id: docRef.id, ...task };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get all tasks
  async getAllTasks() {
    try {
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Get task by ID
  async getTaskById(id) {
    try {
      const docRef = doc(db, 'tasks', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  },

  // Update task
  async updateTask(id, taskData) {
    try {
      const docRef = doc(db, 'tasks', id);
      await updateDoc(docRef, {
        ...taskData,
        updatedAt: Timestamp.now()
      });
      return { id, ...taskData };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  async deleteTask(id) {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Get tasks by department
  async getTasksByDepartment(department) {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('department', '==', department),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting department tasks:', error);
      throw error;
    }
  },

  // Get tasks by assignee
  async getTasksByAssignee(userId) {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('assignedTo', 'array-contains', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting assigned tasks:', error);
      throw error;
    }
  },

  // Department KPI Dashboard
  async getDepartmentKPIs(department) {
    try {
      const tasks = await this.getTasksByDepartment(department);
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending').length;
      const overdueTasks = tasks.filter(t => {
        if (t.status !== 'completed' && t.dueDate) {
          const dueDate = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
          return dueDate < new Date();
        }
        return false;
      }).length;

      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      return {
        department,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        completionRate: completionRate.toFixed(2),
        recentTasks: tasks.slice(0, 5)
      };
    } catch (error) {
      console.error('Error getting department KPIs:', error);
      throw error;
    }
  },

  // Overall KPI Overview
  async getOverallKPIs() {
    try {
      const tasks = await this.getAllTasks();
      
      // Group by department
      const departments = [...new Set(tasks.map(t => t.department))];
      const departmentKPIs = await Promise.all(
        departments.map(dept => this.getDepartmentKPIs(dept))
      );

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const overallCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        totalTasks,
        completedTasks,
        overallCompletionRate: overallCompletionRate.toFixed(2),
        departmentBreakdown: departmentKPIs,
        recentActivity: tasks.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting overall KPIs:', error);
      throw error;
    }
  }
};

// Chatbot Services - Pikachu (Navani's Module)
export const chatbotService = {
  // Get FAQ knowledge base
  async getFAQs() {
    try {
      const querySnapshot = await getDocs(collection(db, 'chatbot_faqs'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting FAQs:', error);
      throw error;
    }
  },

  // Add FAQ to knowledge base
  async addFAQ(faqData) {
    try {
      const faq = {
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category || 'general',
        keywords: faqData.keywords || [],
        module: faqData.module || 'general',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'chatbot_faqs'), faq);
      return { id: docRef.id, ...faq };
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  },

  // Update FAQ
  async updateFAQ(id, faqData) {
    try {
      const docRef = doc(db, 'chatbot_faqs', id);
      await updateDoc(docRef, {
        ...faqData,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  },

  // Delete FAQ
  async deleteFAQ(id) {
    try {
      await deleteDoc(doc(db, 'chatbot_faqs', id));
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  },

  // Search FAQs by query
  async searchFAQs(query) {
    try {
      const faqs = await this.getFAQs();
      const searchTerm = query.toLowerCase();
      
      return faqs.filter(faq => 
        faq.question?.toLowerCase().includes(searchTerm) ||
        faq.answer?.toLowerCase().includes(searchTerm) ||
        faq.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error('Error searching FAQs:', error);
      throw error;
    }
  },

  // Get FAQs by module
  async getFAQsByModule(module) {
    try {
      const q = query(
        collection(db, 'chatbot_faqs'),
        where('module', '==', module)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting module FAQs:', error);
      throw error;
    }
  },

  // Save chat conversation
  async saveChatHistory(chatData) {
    try {
      const chat = {
        userId: chatData.userId || 'anonymous',
        message: chatData.message,
        response: chatData.response,
        timestamp: Timestamp.now(),
        helpful: chatData.helpful || null,
        sessionId: chatData.sessionId || null
      };

      const docRef = await addDoc(collection(db, 'chat_history'), chat);
      return { id: docRef.id, ...chat };
    } catch (error) {
      console.error('Error saving chat history:', error);
      throw error;
    }
  },

  // Get chat history by user
  async getChatHistory(userId, limit = 50) {
    try {
      const q = query(
        collection(db, 'chat_history'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return history.slice(0, limit);
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  },

  // Get chatbot analytics
  async getChatbotAnalytics() {
    try {
      const chatHistory = await getDocs(collection(db, 'chat_history'));
      const chats = chatHistory.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalChats = chats.length;
      const helpfulChats = chats.filter(chat => chat.helpful === true).length;
      const unhelpfulChats = chats.filter(chat => chat.helpful === false).length;
      const satisfactionRate = totalChats > 0 ? (helpfulChats / totalChats) * 100 : 0;

      return {
        totalChats,
        helpfulChats,
        unhelpfulChats,
        satisfactionRate: satisfactionRate.toFixed(2),
        recentChats: chats.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting chatbot analytics:', error);
      throw error;
    }
  }
};
