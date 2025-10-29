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
