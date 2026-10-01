import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import {
  LeadDocument,
  LeadNote,
  UserProfile,
  WeddingDocument,
  WeddingPlanDocument,
  BudgetDocument,
  GuestDocument,
  VendorDocument,
  TaskDocument,
  MessageDocument,
  RSVPDocument,
  ConsultationDocument,
} from '../types/firebase';

// Global Circuit Breaker to prevent continuous Firestore permission error storms
let isFirestoreBlocked = false;

export const resetFirestoreCircuitBreaker = () => {
  isFirestoreBlocked = false;
};

export const getFirestoreBlockedStatus = () => isFirestoreBlocked;

function handleQueryError(err: any, path: string, op: OperationType): any {
  const msg = err?.message || String(err || '');
  const code = err?.code || '';
  if (
    code === 'permission-denied' ||
    msg.includes('Missing or insufficient permissions') ||
    msg.includes('permission-denied')
  ) {
    if (!isFirestoreBlocked) {
      console.warn(`[Firestore] Security policy restriction on /${path}. Circuit breaker activated — routing to local offline cache.`);
      isFirestoreBlocked = true;
    }
    return [];
  }
  return handleFirestoreError(err, op, path);
}

export class FirestoreService {
  // -------------------------------------------------------------
  // CONSULTATIONS & INQUIRIES
  // -------------------------------------------------------------
  static async createConsultation(consultation: {
    fullName: string;
    partnerName?: string;
    email: string;
    phone: string;
    destination: string;
    eventDate: string;
    guestCount: string | number;
    budgetEnvelope: string;
    vision?: string;
    source?: string;
  }): Promise<string> {
    const path = 'consultations';
    try {
      const payload = {
        fullName: consultation.fullName.trim(),
        partnerName: consultation.partnerName?.trim() || '',
        email: consultation.email.trim(),
        phone: consultation.phone.trim(),
        destination: consultation.destination,
        eventDate: consultation.eventDate,
        guestCount: consultation.guestCount,
        budgetEnvelope: consultation.budgetEnvelope,
        vision: consultation.vision?.trim() || '',
        source: consultation.source || 'Private Directorial Consultation Modal',
        status: 'new',
        submittedAt: serverTimestamp(),
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);

      // Concurrently synchronize with the Leads CRM pipeline
      try {
        const coupleName = consultation.partnerName?.trim()
          ? `${consultation.fullName.trim()} & ${consultation.partnerName.trim()}`
          : consultation.fullName.trim();
        await this.createLead({
          name: coupleName,
          email: consultation.email.trim(),
          phone: consultation.phone.trim(),
          weddingDate: consultation.eventDate,
          location: consultation.destination,
          guestCount: Number(consultation.guestCount) || 300,
          budget: consultation.budgetEnvelope,
          services: ['Private Directorial Consultation', 'Haute Scenography'],
          source: consultation.source || 'Private Directorial Consultation Modal',
          status: 'new',
          notes: consultation.vision?.trim() || `Consultation request scheduled for ${consultation.eventDate}.`,
        });
      } catch (leadErr) {
        console.warn('Leads pipeline sync notice (non-fatal):', leadErr);
      }

      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getConsultations(): Promise<ConsultationDocument[]> {
    const path = 'consultations';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ConsultationDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  // -------------------------------------------------------------
  // LEADS
  // -------------------------------------------------------------
  static async createLead(lead: Omit<LeadDocument, 'id' | 'createdAt'>): Promise<string> {
    const path = 'leads';
    try {
      const payload: LeadDocument = {
        ...lead,
        status: lead.status || 'new',
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getLeads(): Promise<LeadDocument[]> {
    const path = 'leads';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async seedInitialLeadsIfEmpty(): Promise<LeadDocument[]> {
    try {
      const existing = await this.getLeads();
      if (existing && existing.length > 0) {
        return existing;
      }
      const { INITIAL_LUXURY_LEADS } = await import('../data/seedLeads');
      const created: LeadDocument[] = [];
      for (const leadData of INITIAL_LUXURY_LEADS) {
        const id = await this.createLead(leadData);
        created.push({ id, ...leadData });
      }
      return created;
    } catch (e) {
      console.warn('Auto-seed leads check:', e);
      return [];
    }
  }


  static async updateLeadStatus(leadId: string, status: LeadDocument['status']): Promise<void> {
    const path = `leads/${leadId}`;
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async updateLead(leadId: string, updates: Partial<LeadDocument>): Promise<void> {
    const path = `leads/${leadId}`;
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async deleteLead(leadId: string): Promise<void> {
    const path = `leads/${leadId}`;
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  static async addLeadNote(leadId: string, text: string, authorName = 'Director'): Promise<void> {
    const path = `leads/${leadId}`;
    try {
      const leadRef = doc(db, 'leads', leadId);
      const leadSnap = await getDoc(leadRef);
      if (leadSnap.exists()) {
        const currentData = leadSnap.data() as LeadDocument;
        const newNote: LeadNote = {
          id: `note-${Date.now()}`,
          text,
          author: authorName,
          createdAt: new Date().toISOString(),
        };
        const updatedList = [newNote, ...(currentData.notesList || [])];
        await updateDoc(leadRef, {
          notesList: updatedList,
          notes: text, // sync primary note field
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async getAllUsers(): Promise<UserProfile[]> {
    const path = 'users';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ ...d.data() } as UserProfile));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async getAllGuests(): Promise<GuestDocument[]> {
    const path = 'guests';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GuestDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async getAllVendors(): Promise<VendorDocument[]> {
    const path = 'vendors';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VendorDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }


  // -------------------------------------------------------------
  // WEDDINGS
  // -------------------------------------------------------------
  static async createWedding(wedding: Omit<WeddingDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const path = 'weddings';
    try {
      const payload: WeddingDocument = {
        ...wedding,
        status: wedding.status || 'planning',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getUserWeddings(userId: string): Promise<WeddingDocument[]> {
    if (!userId) return [];
    const path = 'weddings';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WeddingDocument));
    } catch (err: any) {
      if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
        console.info('[FirestoreService] Scoped user weddings access restricted by security rules. Graceful local fallback active.');
        return [];
      }
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async getClientWeddingByEmailOrId(userId: string, email?: string): Promise<WeddingDocument | null> {
    if (!userId && !email) return null;
    const path = 'weddings';
    try {
      if (email) {
        const qEmail = query(collection(db, path), where('clientEmail', '==', email.toLowerCase()), limit(1));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          const d = snapEmail.docs[0];
          return { id: d.id, ...d.data() } as WeddingDocument;
        }
      }
      if (userId) {
        const qUser = query(collection(db, path), where('userId', '==', userId), limit(1));
        const snapUser = await getDocs(qUser);
        if (!snapUser.empty) {
          const d = snapUser.docs[0];
          return { id: d.id, ...d.data() } as WeddingDocument;
        }
      }
      return null;
    } catch (err: any) {
      // Catch permission errors silently to prevent infinite retry storms
      console.info('[FirestoreService] Scoped client wedding query notice (offline/permission fallback):', err?.message || err);
      return null;
    }
  }

  static async getOrCreateClientWedding(
    userId: string,
    clientName = 'Rahul'
  ): Promise<WeddingDocument> {
    const fallbackWedding: WeddingDocument = {
      id: 'w-fallback',
      userId: userId || 'anonymous',
      clientName: clientName || 'Esteemed Client',
      partnerName: 'Not Available',
      weddingDate: '2026-12-18',
      location: 'Udaipur, Rajasthan',
      guestCount: 350,
      budget: 6500000,
      aesthetic: 'Royal Mewar Heritage',
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Do NOT run remote Firestore creation unless fully authenticated and not blocked
    if (!auth.currentUser || !userId || isFirestoreBlocked) {
      return fallbackWedding;
    }

    try {
      const existing = await this.getUserWeddings(userId);
      if (existing && existing.length > 0) {
        return existing[0];
      }

      // Create new initial wedding for the client
      const partner = 'Not Available';
      const newWeddingData: Omit<WeddingDocument, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        clientName: clientName || 'Esteemed Client',
        partnerName: partner,
        weddingDate: '2026-12-18',
        location: 'Udaipur, Rajasthan',
        guestCount: 350,
        budget: 6500000,
        aesthetic: 'Royal Mewar Heritage & Candlelit Scenography',
        status: 'planning',
      };

      const newId = await this.createWedding(newWeddingData).catch(() => `w-${Date.now()}`);
      const createdWedding: WeddingDocument = {
        id: newId,
        ...newWeddingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Seed core initial tasks
      const initialTasks = [
        { title: 'Venue Finalization & Jagmandir Island Lock', category: 'Venue', dueDate: '2026-10-15', priority: 'urgent' as const, status: 'in_progress' as const },
        { title: 'Cinematographer & Royal Editorial Photographer', category: 'Photographer', dueDate: '2026-10-25', priority: 'high' as const, status: 'todo' as const },
        { title: 'Palace Mandap Scenography & Floral Architecture', category: 'Decor', dueDate: '2026-11-01', priority: 'high' as const, status: 'in_progress' as const },
        { title: 'Bespoke Wax-Sealed Invitations Dispatch', category: 'Invitations', dueDate: '2026-11-10', priority: 'medium' as const, status: 'todo' as const },
        { title: 'Guest Confirmation & Royal Suite Allocation', category: 'Guest confirmation', dueDate: '2026-11-20', priority: 'medium' as const, status: 'todo' as const },
      ];

      for (const t of initialTasks) {
        await this.addTask({
          userId,
          weddingId: newId,
          ...t,
        }).catch(() => null);
      }

      return createdWedding;
    } catch (e) {
      return fallbackWedding;
    }
  }


  static async getAllWeddings(): Promise<WeddingDocument[]> {
    const path = 'weddings';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WeddingDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  // -------------------------------------------------------------
  // WEDDING PLANS (Plan My Wedding Persistence)
  // -------------------------------------------------------------
  static async saveWeddingPlan(plan: Omit<WeddingPlanDocument, 'id' | 'createdAt'>): Promise<string> {
    const path = 'weddingPlans';
    try {
      const payload: WeddingPlanDocument = {
        ...plan,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getUserWeddingPlans(userId: string): Promise<WeddingPlanDocument[]> {
    const path = 'weddingPlans';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WeddingPlanDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async getAllWeddingPlans(): Promise<WeddingPlanDocument[]> {
    const path = 'weddingPlans';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WeddingPlanDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  // -------------------------------------------------------------
  // BUDGETS (Budget Planner Persistence)
  // -------------------------------------------------------------
  static async saveBudget(budgetData: Omit<BudgetDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const path = 'budgets';
    try {
      const payload: BudgetDocument = {
        ...budgetData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getUserBudgets(userId: string): Promise<BudgetDocument[]> {
    const path = 'budgets';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BudgetDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  // -------------------------------------------------------------
  // GUESTS
  // -------------------------------------------------------------
  static async addGuest(guest: Omit<GuestDocument, 'id' | 'createdAt'>): Promise<string> {
    const path = 'guests';
    try {
      const payload: GuestDocument = {
        ...guest,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getWeddingGuests(weddingId: string, limitCount?: number): Promise<GuestDocument[]> {
    const path = 'guests';
    try {
      const q = limitCount
        ? query(collection(db, path), where('weddingId', '==', weddingId), limit(limitCount))
        : query(collection(db, path), where('weddingId', '==', weddingId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GuestDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async getUserGuests(userId: string): Promise<GuestDocument[]> {
    const path = 'guests';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GuestDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async updateGuest(guestId: string, updates: Partial<GuestDocument>): Promise<void> {
    const path = `guests/${guestId}`;
    try {
      await updateDoc(doc(db, 'guests', guestId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async deleteGuest(guestId: string): Promise<void> {
    const path = `guests/${guestId}`;
    try {
      await deleteDoc(doc(db, 'guests', guestId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  // -------------------------------------------------------------
  // VENDORS
  // -------------------------------------------------------------
  static async addVendor(vendor: Omit<VendorDocument, 'id' | 'createdAt'>): Promise<string> {
    const path = 'vendors';
    try {
      const payload: VendorDocument = {
        ...vendor,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getWeddingVendors(weddingId: string): Promise<VendorDocument[]> {
    const path = 'vendors';
    try {
      const q = query(collection(db, path), where('weddingId', '==', weddingId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VendorDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async getUserVendors(userId: string): Promise<VendorDocument[]> {
    const path = 'vendors';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VendorDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async updateVendor(vendorId: string, updates: Partial<VendorDocument>): Promise<void> {
    const path = `vendors/${vendorId}`;
    try {
      await updateDoc(doc(db, 'vendors', vendorId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async deleteVendor(vendorId: string): Promise<void> {
    const path = `vendors/${vendorId}`;
    try {
      await deleteDoc(doc(db, 'vendors', vendorId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  // -------------------------------------------------------------
  // TASKS
  // -------------------------------------------------------------
  static async addTask(task: Omit<TaskDocument, 'id' | 'createdAt'>): Promise<string> {
    const path = 'tasks';
    try {
      const payload: TaskDocument = {
        ...task,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getWeddingTasks(weddingId: string): Promise<TaskDocument[]> {
    const path = 'tasks';
    try {
      const q = query(collection(db, path), where('weddingId', '==', weddingId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TaskDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async getUserTasks(userId: string): Promise<TaskDocument[]> {
    const path = 'tasks';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TaskDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async updateTask(taskId: string, updates: Partial<TaskDocument>): Promise<void> {
    const path = `tasks/${taskId}`;
    try {
      await updateDoc(doc(db, 'tasks', taskId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async updateTaskStatus(taskId: string, status: TaskDocument['status']): Promise<void> {
    const path = `tasks/${taskId}`;
    try {
      await updateDoc(doc(db, 'tasks', taskId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    const path = `tasks/${taskId}`;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }


  // -------------------------------------------------------------
  // MESSAGES
  // -------------------------------------------------------------
  static async sendMessage(msg: Omit<MessageDocument, 'id' | 'createdAt'>): Promise<string> {
    const path = 'messages';
    try {
      const payload: MessageDocument = {
        ...msg,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getUserMessages(userId: string): Promise<MessageDocument[]> {
    const path = 'messages';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MessageDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  // -------------------------------------------------------------
  // RSVPS
  // -------------------------------------------------------------
  static async submitRSVP(rsvp: Omit<RSVPDocument, 'id' | 'submittedAt'>): Promise<string> {
    const path = 'rsvps';
    try {
      const payload: RSVPDocument = {
        ...rsvp,
        submittedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, path), payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async getWeddingRSVPs(weddingId: string): Promise<RSVPDocument[]> {
    const path = 'rsvps';
    try {
      const q = query(collection(db, path), where('weddingId', '==', weddingId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as RSVPDocument));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }
}
