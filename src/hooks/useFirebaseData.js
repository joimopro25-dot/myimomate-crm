// hooks/useFirebaseData.js - Enhanced version (replace your current file)
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';

export const useFirebaseData = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [deals, setDeals] = useState([]); // NEW: Separate deals tracking
  const [tasks, setTasks] = useState([]);
  const [communications, setCommunications] = useState([]); // NEW: Communication history
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribes = [];
    let loadedCount = 0;
    const totalCollections = 5; // Increased from 3 to 5

    const handleLoadComplete = () => {
      loadedCount++;
      if (loadedCount === totalCollections) {
        setLoading(false);
      }
    };

    try {
      // EXISTING: Listen to leads (unchanged)
      const leadsRef = collection(db, `users/${user.uid}/leads`);
      const leadsQuery = query(leadsRef, orderBy('createdAt', 'desc'));
      unsubscribes.push(
        onSnapshot(leadsQuery, 
          (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date()
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

      // ENHANCED: Listen to clients with multi-role support
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
                createdAt: data.createdAt?.toDate() || new Date(),
                lastContact: data.lastContact?.toDate() || new Date(),
                // BACKWARD COMPATIBILITY: If old format, convert to new format
                activeRoles: data.activeRoles || (data.type ? {
                  [data.type]: {
                    stage: data.stage || 'qualification',
                    budget: data.budget || '',
                    location: data.location || '',
                    urgency: 'medium',
                    lastActivity: data.lastContact?.toDate() || new Date()
                  }
                } : {}),
                // Keep old fields for compatibility
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

      // NEW: Listen to deals
      const dealsRef = collection(db, `users/${user.uid}/deals`);
      const dealsQuery = query(dealsRef, orderBy('createdAt', 'desc'));
      unsubscribes.push(
        onSnapshot(dealsQuery, 
          (snapshot) => {
            const dealsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              expectedCloseDate: doc.data().expectedCloseDate?.toDate() || new Date(),
              lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
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

      // EXISTING: Listen to tasks (unchanged)
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      const tasksQuery = query(tasksRef, orderBy('dueDate', 'asc'));
      unsubscribes.push(
        onSnapshot(tasksQuery, 
          (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              dueDate: doc.data().dueDate?.toDate() || new Date(),
              completedAt: doc.data().completedAt?.toDate()
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

      // NEW: Listen to communications
      const communicationsRef = collection(db, `users/${user.uid}/communications`);
      const communicationsQuery = query(communicationsRef, orderBy('timestamp', 'desc'));
      unsubscribes.push(
        onSnapshot(communicationsQuery, 
          (snapshot) => {
            const communicationsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate() || new Date()
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

  // EXISTING: Add new lead (unchanged)
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

  // ENHANCED: Convert lead to client with multi-role support
  const convertLeadToClient = async (lead) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      // Create client with new multi-role structure
      const clientsRef = collection(db, `users/${user.uid}/clients`);
      const clientData = {
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        source: lead.source,
        notes: lead.notes || '',
        lastContact: serverTimestamp(),
        createdAt: serverTimestamp(),
        
        // NEW: Multi-role structure
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
        
        // BACKWARD COMPATIBILITY: Keep old fields
        type: lead.type,
        stage: 'qualification',
        
        // NEW: Enhanced tracking
        healthScore: 50, // Starting health score
        lifetimeValue: 0,
        relationshipStrength: 'new'
      };

      const clientDoc = await addDoc(clientsRef, clientData);

      // Delete from leads collection
      await deleteDoc(doc(db, `users/${user.uid}/leads`, lead.id));

      // Create follow-up task
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      await addDoc(tasksRef, {
        title: `Welcome call with ${lead.name}`,
        clientId: clientDoc.id,
        clientName: lead.name,
        type: 'call',
        priority: 'high',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        completed: false,
        createdAt: serverTimestamp(),
        description: `Initial consultation to understand ${lead.type} requirements`
      });

      // Log communication
      await logCommunication({
        clientId: clientDoc.id,
        type: 'lead_conversion',
        content: `Lead converted to client - ${lead.type} interest`,
        direction: 'internal'
      });

    } catch (error) {
      console.error('Error converting lead to client:', error);
      setError(error);
    }
  };

  // ENHANCED: Add new client with multi-role support
  const addClient = async (clientData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    try {
      const clientsRef = collection(db, `users/${user.uid}/clients`);
      
      const enhancedClientData = {
        ...clientData,
        lastContact: serverTimestamp(),
        createdAt: serverTimestamp(),
        
        // NEW: Multi-role structure
        activeRoles: clientData.activeRoles || {
          [clientData.type || 'buyer']: {
            stage: 'qualification',
            budget: clientData.budget || '',
            location: clientData.location || '',
            urgency: 'medium',
            lastActivity: serverTimestamp()
          }
        },
        
        // BACKWARD COMPATIBILITY
        stage: clientData.stage || 'qualification',
        
        // NEW: Enhanced tracking
        healthScore: 50,
        lifetimeValue: 0,
        relationshipStrength: 'new'
      };

      await addDoc(clientsRef, enhancedClientData);
    } catch (error) {
      console.error('Error adding client:', error);
      setError(error);
    }
  };

  // NEW: Add role to existing client
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
          ...roleData
        },
        lastContact: serverTimestamp()
      });

      // Log the role addition
      await logCommunication({
        clientId,
        type: 'role_added',
        content: `Added ${roleType} role to client`,
        direction: 'internal'
      });

    } catch (error) {
      console.error('Error adding client role:', error);
      setError(error);
    }
  };

  // ENHANCED: Update client stage for specific role
  const updateClientStage = async (clientId, newStage, roleType = null) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const clientRef = doc(db, `users/${user.uid}/clients`, clientId);
      
      if (roleType) {
        // Update specific role stage
        await updateDoc(clientRef, {
          [`activeRoles.${roleType}.stage`]: newStage,
          [`activeRoles.${roleType}.lastActivity`]: serverTimestamp(),
          lastContact: serverTimestamp()
        });
      } else {
        // BACKWARD COMPATIBILITY: Update main stage
        await updateDoc(clientRef, {
          stage: newStage,
          lastContact: serverTimestamp()
        });
      }

      // Update health score based on stage progression
      await updateClientHealthScore(clientId, newStage);

    } catch (error) {
      console.error('Error updating client stage:', error);
      setError(error);
    }
  };

  // NEW: Update client health score
  const updateClientHealthScore = async (clientId, stage) => {
    const stageScores = {
      qualification: 30,
      visits: 50,
      negotiating: 70,
      cpcv: 85,
      contract: 85,
      deed: 95,
      completed: 100
    };

    const score = stageScores[stage] || 50;
    
    try {
      const clientRef = doc(db, `users/${user.uid}/clients`, clientId);
      await updateDoc(clientRef, {
        healthScore: score,
        lastContact: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating health score:', error);
    }
  };

  // NEW: Create deal
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

      // Update client's active deals
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

  // NEW: Update deal
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

  // NEW: Log communication
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

      // Update client's last contact if clientId provided
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

  // EXISTING: Task functions (unchanged)
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

  // NEW: Get client stats
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

  return {
    // EXISTING: Data (backward compatible)
    leads,
    clients,
    tasks,
    loading,
    error,
    
    // NEW: Enhanced data
    deals,
    communications,
    
    // EXISTING: Actions (backward compatible)
    addLead,
    convertLeadToClient,
    addClient,
    updateClientStage,
    addTask,
    completeTask,
    deleteTask,
    clearError,
    
    // NEW: Enhanced actions
    addClientRole,
    createDeal,
    updateDeal,
    logCommunication,
    getClientStats,
    updateClientHealthScore
  };
};