// hooks/useFirebaseData.js - Complete Fixed Version
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,      
  orderBy, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';

// ✅ HELPER FUNCTION TO SAFELY CONVERT FIREBASE DATES
const safeToDate = (timestamp) => {
  if (!timestamp) return new Date();
  
  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp;
  
  // If it's a Firebase Timestamp with toDate method
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If it's a string or number, convert to Date
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  // Default fallback
  return new Date();
};

export const useFirebaseData = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribes = [];
    let loadedCount = 0;
    const totalCollections = 5;

    const handleLoadComplete = () => {
      loadedCount++;
      if (loadedCount === totalCollections) {
        setLoading(false);
      }
    };

    try {
      // ✅ FIXED: Listen to leads
      const leadsRef = collection(db, `users/${user.uid}/leads`);
      const leadsQuery = query(leadsRef, orderBy('createdAt', 'desc'));
      unsubscribes.push(
        onSnapshot(leadsQuery, 
          (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: safeToDate(doc.data().createdAt)
            }));
            setLeads(leadsData);
            handleLoadComplete();
          },
          (error) => {
            console.error('Error fetching leads:', error);
            setError(error);
            setLeads([]);
            handleLoadComplete();
          }
        )
      );

      // ✅ FIXED: Listen to clients
      const clientsRef = collection(db, `users/${user.uid}/clients`);
      const clientsQuery = query(clientsRef, orderBy('lastContact', 'desc'));
      unsubscribes.push(
        onSnapshot(clientsQuery, 
          (snapshot) => {
            const clientsData = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: safeToDate(data.createdAt),
                lastContact: safeToDate(data.lastContact),
                activeRoles: data.activeRoles || (data.type ? {
                  [data.type]: {
                    stage: data.stage || 'qualification',
                    budget: data.budget || '',
                    location: data.location || '',
                    urgency: 'medium',
                    lastActivity: safeToDate(data.lastContact)
                  }
                } : {}),
                type: data.type || (data.activeRoles ? Object.keys(data.activeRoles)[0] : 'buyer'),
                stage: data.stage || 'qualification'
              };
            });
            setClients(clientsData);
            handleLoadComplete();
          },
          (error) => {
            console.error('Error fetching clients:', error);
            setError(error);
            setClients([]);
            handleLoadComplete();
          }
        )
      );

      // ✅ FIXED: Listen to deals
      const dealsRef = collection(db, `users/${user.uid}/deals`);
      const dealsQuery = query(dealsRef, orderBy('createdAt', 'desc'));
      unsubscribes.push(
        onSnapshot(dealsQuery, 
          (snapshot) => {
            const dealsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: safeToDate(doc.data().createdAt),
              expectedCloseDate: safeToDate(doc.data().expectedCloseDate),
              lastUpdated: safeToDate(doc.data().lastUpdated)
            }));
            setDeals(dealsData);
            handleLoadComplete();
          },
          (error) => {
            console.error('Error fetching deals:', error);
            setError(error);
            setDeals([]);
            handleLoadComplete();
          }
        )
      );

      // ✅ FIXED: Listen to tasks
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      const tasksQuery = query(tasksRef, orderBy('dueDate', 'asc'));
      unsubscribes.push(
        onSnapshot(tasksQuery, 
          (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: safeToDate(doc.data().createdAt),
              dueDate: safeToDate(doc.data().dueDate),
              completedAt: safeToDate(doc.data().completedAt)
            }));
            setTasks(tasksData);
            handleLoadComplete();
          },
          (error) => {
            console.error('Error fetching tasks:', error);
            setError(error);
            setTasks([]);
            handleLoadComplete();
          }
        )
      );

      // ✅ FIXED: Listen to communications
      const communicationsRef = collection(db, `users/${user.uid}/communications`);
      const communicationsQuery = query(communicationsRef, orderBy('timestamp', 'desc'));
      unsubscribes.push(
        onSnapshot(communicationsQuery, 
          (snapshot) => {
            const communicationsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: safeToDate(doc.data().timestamp)
            }));
            setCommunications(communicationsData);
            handleLoadComplete();
          },
          (error) => {
            console.error('Error fetching communications:', error);
            setError(error);
            setCommunications([]);
            handleLoadComplete();
          }
        )
      );

    } catch (error) {
      console.error('Error setting up listeners:', error);
      setError(error);
      setLoading(false);
    }

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [user]);

  // Add new lead
  const addLead = async (leadData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    try {
      const leadsRef = collection(db, `users/${user.uid}/leads`);
      await addDoc(leadsRef, {
        ...leadData,
        status: 'new',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding lead:', error);
      setError(error);
    }
  };

  // Convert lead to client
  const convertLeadToClient = async (lead) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const clientsRef = collection(db, `users/${user.uid}/clients`);
      const clientData = {
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        source: lead.source,
        notes: lead.notes || '',
        lastContact: serverTimestamp(),
        createdAt: serverTimestamp(),
        activeRoles: {
          [lead.type]: {
            stage: 'qualification',
            budget: lead.budget || '',
            location: lead.location || '',
            urgency: 'medium',
            lastActivity: serverTimestamp(),
            preferences: lead.preferences || ''
          }
        },
        type: lead.type,
        stage: 'qualification',
        healthScore: 50,
        lifetimeValue: 0,
        relationshipStrength: 'new'
      };

      const clientDoc = await addDoc(clientsRef, clientData);
      await deleteDoc(doc(db, `users/${user.uid}/leads`, lead.id));

      console.log('Lead converted to client:', clientDoc.id);
      return clientDoc.id;
    } catch (error) {
      console.error('Error converting lead to client:', error);
      setError(error);
    }
  };

  // Add new client
  const addClient = async (clientData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const clientsRef = collection(db, `users/${user.uid}/clients`);
      const newClient = {
        ...clientData,
        createdAt: serverTimestamp(),
        lastContact: serverTimestamp(),
        activeRoles: {
          [clientData.type]: {
            stage: 'qualification',
            budget: clientData.budget || '',
            location: clientData.location || '',
            urgency: 'medium',
            lastActivity: serverTimestamp()
          }
        },
        stage: 'qualification',
        healthScore: 50,
        lifetimeValue: 0,
        relationshipStrength: 'new'
      };

      const clientDoc = await addDoc(clientsRef, newClient);
      console.log('Client added:', clientDoc.id);
      return clientDoc.id;
    } catch (error) {
      console.error('Error adding client:', error);
      setError(error);
    }
  };

  // Update client
  const updateClient = async (clientId, updates) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const clientRef = doc(db, `users/${user.uid}/clients`, clientId);
      await updateDoc(clientRef, {
        ...updates,
        lastContact: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating client:', error);
      setError(error);
    }
  };

    
// Add this function to your useFirebaseData.js hook

  // Delete client function - ADD THIS TO YOUR useFirebaseData.js
  const deleteClient = async (clientId) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      // Delete the client document
      await deleteDoc(doc(db, `users/${user.uid}/clients`, clientId));
      
      // Optional: Also delete related data (tasks, communications, deals)
      // You can choose to delete or keep this data based on your requirements
      
      // Delete related tasks
      const tasksQuery = query(
        collection(db, `users/${user.uid}/tasks`),
        where('clientId', '==', clientId)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const deleteTaskPromises = tasksSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteTaskPromises);

      // Delete related communications
      const communicationsQuery = query(
        collection(db, `users/${user.uid}/communications`),
        where('clientId', '==', clientId)
      );
      const communicationsSnapshot = await getDocs(communicationsQuery);
      const deleteCommunicationPromises = communicationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteCommunicationPromises);

      // Delete related deals
      const dealsQuery = query(
        collection(db, `users/${user.uid}/deals`),
        where('clientId', '==', clientId)
      );
      const dealsSnapshot = await getDocs(dealsQuery);
      const deleteDealPromises = dealsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteDealPromises);

      console.log('Client and related data deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      setError(error);
      throw error; // Re-throw so the UI can handle the error
    }
  };


  // Update client stage
  const updateClientStage = async (clientId, newStage) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const clientRef = doc(db, `users/${user.uid}/clients`, clientId);
      await updateDoc(clientRef, {
        stage: newStage,
        lastContact: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating client stage:', error);
      setError(error);
    }
  };

  // Add client role
  const addClientRole = async (clientId, roleType, roleData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const clientRef = doc(db, `users/${user.uid}/clients`, clientId);
      await updateDoc(clientRef, {
        [`activeRoles.${roleType}`]: {
          stage: 'qualification',
          budget: roleData.budget || '',
          location: roleData.location || '',
          urgency: roleData.urgency || 'medium',
          lastActivity: serverTimestamp(),
          preferences: roleData.preferences || ''
        },
        lastContact: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding client role:', error);
      setError(error);
    }
  };

  // Update client health score
  const updateClientHealthScore = async (clientId, score) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const clientRef = doc(db, `users/${user.uid}/clients`, clientId);
      await updateDoc(clientRef, {
        healthScore: score,
        lastContact: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating health score:', error);
      setError(error);
    }
  };

  // Create deal
  const createDeal = async (dealData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const dealsRef = collection(db, `users/${user.uid}/deals`);
      const dealDoc = await addDoc(dealsRef, {
        ...dealData,
        status: 'active',
        stage: dealData.stage || 'initial',
        probability: dealData.probability || 50,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        milestones: dealData.milestones || []
      });

      if (dealData.clientId) {
        const clientRef = doc(db, `users/${user.uid}/clients`, dealData.clientId);
        await updateDoc(clientRef, {
          activeDeals: arrayUnion(dealDoc.id),
          lifetimeValue: dealData.value || 0
        });
      }

      return dealDoc.id;
    } catch (error) {
      console.error('Error creating deal:', error);
      setError(error);
    }
  };

  // Update deal
  const updateDeal = async (dealId, updates) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const dealRef = doc(db, `users/${user.uid}/deals`, dealId);
      await updateDoc(dealRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating deal:', error);
      setError(error);
    }
  };

  // Log communication
  const logCommunication = async (communicationData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const communicationsRef = collection(db, `users/${user.uid}/communications`);
      await addDoc(communicationsRef, {
        ...communicationData,
        timestamp: serverTimestamp(),
        userId: user.uid
      });

      if (communicationData.clientId) {
        const clientRef = doc(db, `users/${user.uid}/clients`, communicationData.clientId);
        await updateDoc(clientRef, {
          lastContact: serverTimestamp()
        });
      }

    } catch (error) {
      console.error('Error logging communication:', error);
      setError(error);
    }
  };

  // Task functions
  const addTask = async (taskData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    try {
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      await addDoc(tasksRef, {
        ...taskData,
        completed: false,
        createdAt: serverTimestamp(),
        dueDate: taskData.dueDate || new Date()
      });
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error);
    }
  };

  const completeTask = async (taskId) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
      await updateDoc(taskRef, {
        completed: true,
        completedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error completing task:', error);
      setError(error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      await deleteDoc(doc(db, `users/${user.uid}/tasks`, taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error);
    }
  };

  // Get client stats
  const getClientStats = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return null;

    const clientDeals = deals.filter(d => d.clientId === clientId);
    const clientTasks = tasks.filter(t => t.clientId === clientId);
    const clientComms = communications.filter(c => c.clientId === clientId);

    return {
      activeRolesCount: Object.keys(client.activeRoles || {}).length,
      totalDeals: clientDeals.length,
      activeDeals: clientDeals.filter(d => d.status === 'active').length,
      completedDeals: clientDeals.filter(d => d.status === 'completed').length,
      totalTasks: clientTasks.length,
      pendingTasks: clientTasks.filter(t => !t.completed).length,
      totalCommunications: clientComms.length,
      lastCommunication: clientComms[0]?.timestamp || null,
      lifetimeValue: clientDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
      healthScore: client.healthScore || 50
    };
  };

  const clearError = () => {
    setError(null);
  };

  // ✅ SINGLE RETURN STATEMENT WITH ALL FUNCTIONS
  return {
    // Data
    leads,
    clients,
    tasks,
    loading,
    error,
    deals,
    communications,
    
    // Actions
    addLead,
    convertLeadToClient,
    addClient,
    updateClient,
    deleteClient,
    updateClientStage,
    addTask,
    completeTask,
    deleteTask,
    clearError,
    addClientRole,
    createDeal,
    updateDeal,
    logCommunication,
    getClientStats,
    updateClientHealthScore
  };
};