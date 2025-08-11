// AuthContext.jsx - Properly Fixed - Keeps ALL Features but fixes infinite loop
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Sample data for 7-day trial
const SAMPLE_CLIENTS = [
  {
    name: "John & Mary Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "Active Buyer",
    budget: "$350,000 - $450,000",
    location: "Downtown Area",
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    notes: "Looking for 3BR home, prefer modern style. Pre-approved for $400k.",
    source: "Website Inquiry",
    tags: ["First Time Buyer", "Pre-approved"]
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 987-6543",
    status: "Active Seller",
    budget: "Selling $280,000",
    location: "Westside",
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    notes: "Inherited property, needs to sell quickly. Property in good condition.",
    source: "Referral",
    tags: ["Quick Sale", "Estate"]
  },
  {
    name: "Michael Rodriguez",
    email: "mrodriguez@email.com",
    phone: "+1 (555) 456-7890",
    status: "Potential Lead",
    budget: "$200,000 - $300,000",
    location: "Suburbs",
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    notes: "Relocating for work, needs 4BR family home with good schools nearby.",
    source: "Social Media",
    tags: ["Relocation", "Family"]
  }
];

const SAMPLE_LEADS = [
  {
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 234-5678",
    source: "Facebook Ad",
    status: "New",
    interest: "Buying",
    budget: "$300,000 - $400,000",
    timeline: "3-6 months",
    notes: "Responded to our 'First Time Buyer Guide' ad. Very engaged.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ["Hot Lead", "Social Media"]
  },
  {
    name: "David Park",
    email: "d.park@email.com",
    phone: "+1 (555) 345-6789",
    source: "Website Contact Form",
    status: "Contacted",
    interest: "Selling",
    budget: "Property valued ~$450,000",
    timeline: "1-2 months",
    notes: "Needs market analysis for downtown condo. Scheduled call for tomorrow.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ["Market Analysis", "Downtown"]
  }
];

const SAMPLE_TASKS = [
  {
    title: "Follow up with John & Mary Smith",
    description: "Send them the 3 listings we discussed, schedule showing for Saturday",
    priority: "High",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    status: "pending",
    clientId: "sample-client-1",
    createdAt: new Date(),
    tags: ["Follow-up", "Showing"]
  },
  {
    title: "Prepare CMA for Sarah Johnson",
    description: "Comparative Market Analysis for Westside property - gather recent sales data",
    priority: "Medium",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    status: "pending",
    clientId: "sample-client-2",
    createdAt: new Date(),
    tags: ["CMA", "Market Analysis"]
  },
  {
    title: "Call Emma Wilson (Hot Lead)",
    description: "New lead from Facebook ad - very interested in first-time buyer process",
    priority: "High",
    dueDate: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000), // Today
    status: "pending",
    leadId: "sample-lead-1",
    createdAt: new Date(),
    tags: ["Hot Lead", "Follow-up"]
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔧 FIX: Use useMemo to prevent subscription status recalculation on every render
  const subscriptionStatus = useMemo(() => {
    if (!userProfile) return { status: 'none', canAccess: false, clientCount: 0, maxClients: 0 };

    const now = new Date();
    const trialEnd = userProfile.trialEndDate?.toDate();
    const subscriptionEnd = userProfile.subscriptionEndDate?.toDate();

    // Check if in trial period
    if (userProfile.subscriptionPlan === 'trial' && trialEnd && now < trialEnd) {
      return {
        status: 'trial',
        canAccess: true,
        canModify: true,
        clientCount: userProfile.clientCount || 0,
        maxClients: 50,
        daysLeft: Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000)),
        trialEnd
      };
    }

    // Check if trial expired
    if (userProfile.subscriptionPlan === 'trial' && trialEnd && now >= trialEnd) {
      return {
        status: 'trial_expired',
        canAccess: true,
        canModify: false, // Read-only mode
        clientCount: userProfile.clientCount || 0,
        maxClients: 0,
        message: 'Your free trial has expired. Upgrade to continue managing your clients.'
      };
    }

    // Check active subscription
    if (userProfile.subscriptionPlan === 'normal' && subscriptionEnd && now < subscriptionEnd) {
      return {
        status: 'active',
        canAccess: true,
        canModify: true,
        clientCount: userProfile.clientCount || 0,
        maxClients: 50,
        subscriptionEnd
      };
    }

    if (userProfile.subscriptionPlan === 'pro' && subscriptionEnd && now < subscriptionEnd) {
      return {
        status: 'active',
        canAccess: true,
        canModify: true,
        clientCount: userProfile.clientCount || 0,
        maxClients: 999999, // Unlimited
        subscriptionEnd
      };
    }

    // Default: no active subscription
    return {
      status: 'inactive',
      canAccess: false,
      canModify: false,
      clientCount: userProfile.clientCount || 0,
      maxClients: 0,
      message: 'Please choose a subscription plan to continue.'
    };
  }, [userProfile]); // 🔧 FIX: Only recalculate when userProfile changes

  // Google OAuth sign in
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create new profile for Google user with 7-day trial
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        await setDoc(docRef, {
          email: user.email,
          name: user.displayName || '',
          photoURL: user.photoURL || '',
          subscriptionPlan: 'trial',
          trialEndDate,
          clientCount: 0,
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          authProvider: 'google',
          onboardingCompleted: false,
        });

        // Create sample data for trial
        await createSampleData(user.uid);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Enhanced sign up with email verification
  const signUp = async (email, password, profileData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update display name
      if (profileData.name) {
        await updateProfile(user, { displayName: profileData.name });
      }

      // Send verification email
      await sendEmailVerification(user);

      // Create user profile with 7-day trial
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      await setDoc(doc(db, 'users', user.uid), {
        email,
        name: profileData.name || '',
        company: profileData.company || '',
        licenseNumber: profileData.licenseNumber || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        yearsExperience: profileData.yearsExperience || '',
        specializations: profileData.specializations || [],
        website: profileData.website || '',
        subscriptionPlan: 'trial',
        trialEndDate,
        clientCount: 0,
        emailVerified: false,
        createdAt: serverTimestamp(),
        authProvider: 'email',
        onboardingCompleted: false,
      });

      // Create sample data for trial
      await createSampleData(user.uid);

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Create sample data for new trial users
  const createSampleData = async (userId) => {
    try {
      // Add sample clients
      for (let i = 0; i < SAMPLE_CLIENTS.length; i++) {
        await setDoc(doc(db, `users/${userId}/clients`, `sample-client-${i + 1}`), {
          ...SAMPLE_CLIENTS[i],
          createdAt: serverTimestamp(),
          lastContact: SAMPLE_CLIENTS[i].lastContact,
          isSampleData: true
        });
      }

      // Add sample leads
      for (let i = 0; i < SAMPLE_LEADS.length; i++) {
        await setDoc(doc(db, `users/${userId}/leads`, `sample-lead-${i + 1}`), {
          ...SAMPLE_LEADS[i],
          createdAt: SAMPLE_LEADS[i].createdAt,
          isSampleData: true
        });
      }

      // Add sample tasks
      for (let i = 0; i < SAMPLE_TASKS.length; i++) {
        await setDoc(doc(db, `users/${userId}/tasks`, `sample-task-${i + 1}`), {
          ...SAMPLE_TASKS[i],
          createdAt: serverTimestamp(),
          dueDate: SAMPLE_TASKS[i].dueDate,
          isSampleData: true
        });
      }

      // Update client count
      await updateDoc(doc(db, 'users', userId), {
        clientCount: SAMPLE_CLIENTS.length
      });

    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Sign out user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user authenticated');
      
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Reload profile
      await loadUserProfile(user.uid);
    } catch (error) {
      throw error;
    }
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    try {
      if (!user) throw new Error('No user authenticated');
      
      await updateDoc(doc(db, 'users', user.uid), {
        onboardingCompleted: true,
        updatedAt: serverTimestamp()
      });

      await loadUserProfile(user.uid);
    } catch (error) {
      throw error;
    }
  };

  // 🔧 FIX: Use useMemo for canAddClient to prevent recalculation
  const canAddClient = useMemo(() => {
    if (!userProfile) return false;
    return subscriptionStatus.canModify && subscriptionStatus.clientCount < subscriptionStatus.maxClients;
  }, [userProfile, subscriptionStatus]);

  // Increment client count
  const incrementClientCount = async () => {
    try {
      if (!user || !userProfile) throw new Error('No user authenticated');
      
      const newCount = (userProfile.clientCount || 0) + 1;
      await updateDoc(doc(db, 'users', user.uid), {
        clientCount: newCount,
        updatedAt: serverTimestamp()
      });

      await loadUserProfile(user.uid);
    } catch (error) {
      throw error;
    }
  };

  // Decrement client count
  const decrementClientCount = async () => {
    try {
      if (!user || !userProfile) throw new Error('No user authenticated');
      
      const newCount = Math.max(0, (userProfile.clientCount || 0) - 1);
      await updateDoc(doc(db, 'users', user.uid), {
        clientCount: newCount,
        updatedAt: serverTimestamp()
      });

      await loadUserProfile(user.uid);
    } catch (error) {
      throw error;
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profileData = { id: uid, ...docSnap.data() };
        setUserProfile(profileData);
        return profileData;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔧 FIX: Use useMemo for the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    userProfile,
    subscriptionStatus,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    completeOnboarding,
    canAddClient,
    incrementClientCount,
    decrementClientCount,
    loading
  }), [user, userProfile, subscriptionStatus, canAddClient, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};