// components/SimplifiedCRM.jsx 
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Home, 
  FileText, 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Loader, 
  User, 
  Settings,
  TrendingUp,
  Target,
  Activity,
  BarChart3,
  HandHeart,
  Clock,
  X
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useAuth } from '../AuthContext';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import SimpleClientCard from './SimpleClientCard';
import ExpandedClientForm from './ExpandedClientForm'; // ADD THIS IMPORT

// ADD FIREBASE IMPORTS FOR DEAL MANAGEMENT
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

const EditClientModal = ({ client, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    budget: '',
    location: ''
  });

  // Initialize form when client changes
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        notes: client.notes || '',
        budget: client.budget || '',
        location: client.location || ''
      });
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(client.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Personal Data</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., €250,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Vila Nova de Famalicão"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes about this client..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SimplifiedCRM = () => {
  // Use the enhanced hook (keeping same destructuring for compatibility)
  const {
    leads,
    clients,
    deals = [], // Add default empty array for new features
    tasks,
    communications = [], // Add default empty array for new features
    loading,
    addLead,
    convertLeadToClient,
    addClient,
    updateClient,
    deleteClient,
    updateClientStage,
    addTask,
    completeTask,
    deleteTask,
    // New enhanced functions (with defaults for backward compatibility)
    addClientRole = () => {},
    createDeal = () => {},
    logCommunication = () => {},
    getClientStats = () => null
  } = useFirebaseData();

  const { user, userProfile, subscriptionStatus, logout } = useAuth();

  const [activeView, setActiveView] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [clientFilter, setClientFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formType, setFormType] = useState('client'); // ADD THIS LINE

  // ADD EXPANDED CLIENT SUBMISSION HANDLER
  const handleExpandedClientSubmit = async (expandedFormData) => {
    try {
      // Transform the expanded form data to match the existing client structure
      const clientData = {
        // Basic CRM fields
        name: expandedFormData.name,
        email: expandedFormData.email,
        phone: expandedFormData.phone,
        type: expandedFormData.type,
        source: expandedFormData.source,
        budget: expandedFormData.budget,
        location: expandedFormData.location,
        notes: expandedFormData.notes,
        urgency: expandedFormData.urgency,
        
        // Extended personal information
        personalInfo: {
          birthDate: expandedFormData.birthDate,
          nationality: expandedFormData.nationality,
          placeOfBirth: expandedFormData.placeOfBirth,
          maritalStatus: expandedFormData.maritalStatus,
          propertyRegime: expandedFormData.propertyRegime,
          nif: expandedFormData.nif,
          idNumber: expandedFormData.idNumber,
          drivingLicense: expandedFormData.drivingLicense,
          alternativePhone: expandedFormData.alternativePhone,
          currentAddress: expandedFormData.currentAddress,
          postalCode: expandedFormData.postalCode,
          city: expandedFormData.city,
          district: expandedFormData.district,
        },
        
        // Spouse information (if applicable)
        spouseInfo: (expandedFormData.maritalStatus === 'married' || expandedFormData.maritalStatus === 'civil_union') ? {
          name: expandedFormData.spouseName,
          email: expandedFormData.spouseEmail,
          phone: expandedFormData.spousePhone,
          birthDate: expandedFormData.spouseBirthDate,
          nationality: expandedFormData.spouseNationality,
          placeOfBirth: expandedFormData.spousePlaceOfBirth,
          profession: expandedFormData.spouseProfession,
          employer: expandedFormData.spouseEmployer,
          monthlyIncome: expandedFormData.spouseMonthlyIncome,
        } : null,
        
        // Professional information
        professionalInfo: {
          profession: expandedFormData.profession,
          employer: expandedFormData.employer,
          monthlyIncome: expandedFormData.monthlyIncome,
        },
        
        // Financial information
        financialInfo: {
          bankingInfo: expandedFormData.bankingInfo,
          mortgagePreApproval: expandedFormData.mortgagePreApproval,
          preApprovalAmount: expandedFormData.preApprovalAmount,
        },
        
        // Property preferences
        propertyPreferences: {
          propertyType: expandedFormData.propertyType,
          bedrooms: expandedFormData.bedrooms,
          bathrooms: expandedFormData.bathrooms,
          parking: expandedFormData.parking,
          elevator: expandedFormData.elevator,
          balcony: expandedFormData.balcony,
          garden: expandedFormData.garden,
        },
        
        // Emergency contact
        emergencyContact: {
          name: expandedFormData.emergencyContactName,
          phone: expandedFormData.emergencyContactPhone,
          relation: expandedFormData.emergencyContactRelation,
        },
        
        // Metadata
        createdAt: new Date(),
        lastContact: new Date(),
        stage: 'initial_contact',
        tags: [],
        isExpanded: true, // Flag to indicate this uses expanded data
      };

      if (formType === 'client') {
        await addClient(clientData);
      } else {
        await addLead(clientData);
      }
      
      setShowAddForm(false);
      console.log('Client/Lead added successfully with expanded data');
    } catch (error) {
      console.error('Error adding client/lead:', error);
      alert('Error adding client/lead. Please try again.');
    }
  };

  // FIREBASE DEAL MANAGEMENT FUNCTIONS
  // 🔧 FIXED SimplifiedCRM - Deal Management Functions
// Replace the existing handleSaveDeal and handleDeleteDeal functions in your SimplifiedCRM.jsx

// FIREBASE DEAL MANAGEMENT FUNCTIONS - UPDATED FOR CONSISTENCY
const handleSaveDeal = async (clientId, roleType, dealData) => {
  try {
    console.log('🔧 Saving deal:', {
      clientId,
      roleType,
      dealType: dealData.type,
      dealTitle: dealData.title || dealData.propertyAddress
    });

    const dealToSave = {
      ...dealData,
      clientId,
      roleType,
      type: dealData.type || roleType, // 🔧 ENSURE: type field matches roleType for consistency
      createdAt: dealData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid // Add user ID for multi-tenancy
    };

    // 🎯 CRITICAL: Always save to user-scoped collection for consistency with useFirebaseData
    const dealsRef = collection(db, `users/${user.uid}/deals`);

    if (dealData.id && dealData.isExisting) {
      // Update existing deal - use user-scoped path
      const dealRef = doc(db, `users/${user.uid}/deals`, dealData.id);
      await updateDoc(dealRef, {
        ...dealToSave,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Deal updated successfully:', dealData.id);
    } else {
      // Create new deal - always use addDoc for new deals
      const docRef = await addDoc(dealsRef, dealToSave);
      console.log('✅ Deal created successfully with ID:', docRef.id);
    }
    
    // Success feedback
    console.log('✅ Deal saved successfully');
    
  } catch (error) {
    console.error('❌ Error saving deal:', error);
    alert(`Error saving deal: ${error.message}`);
  }
};

const handleDeleteDeal = async (clientId, roleType, dealId) => {
  try {
    console.log('🗑️ Deleting deal:', {
      clientId,
      roleType,
      dealId
    });

    // 🎯 CRITICAL: Delete from user-scoped collection for consistency
    const dealRef = doc(db, `users/${user.uid}/deals`, dealId);
    await deleteDoc(dealRef);
    console.log('✅ Deal deleted successfully:', dealId);
    
  } catch (error) {
    console.error('❌ Error deleting deal:', error);
    alert(`Error deleting deal: ${error.message}`);
  }
};

// 🔧 ADDITIONAL: Enhanced InvestorDealModal onSaveDeal handler
// Add this enhanced function to handle investor deals specifically
const handleSaveInvestorDeal = async (clientId, roleType, dealData) => {
  try {
    console.log('💰 Saving investor deal:', {
      clientId,
      roleType,
      propertyAddress: dealData.propertyAddress,
      calculations: dealData.calculations
    });

    const investorDealToSave = {
      ...dealData,
      clientId,
      roleType: 'investor', // 🎯 ENSURE: Always set as investor
      type: 'investor', // 🔧 CRITICAL: Set type for filtering
      createdAt: dealData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid,
      // 🎯 ENHANCED: Add investor-specific metadata
      dealCategory: 'investment_analysis',
      isInvestorDeal: true
    };

    const dealsRef = collection(db, `users/${user.uid}/deals`);

    if (dealData.id && dealData.isExisting) {
      // Update existing investor deal
      const dealRef = doc(db, `users/${user.uid}/deals`, dealData.id);
      await updateDoc(dealRef, {
        ...investorDealToSave,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Investor deal updated successfully:', dealData.id);
    } else {
      // Create new investor deal
      const docRef = await addDoc(dealsRef, investorDealToSave);
      console.log('✅ Investor deal created successfully with ID:', docRef.id);
    }
    
  } catch (error) {
    console.error('❌ Error saving investor deal:', error);
    alert(`Error saving investor deal: ${error.message}`);
  }
};

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'clients', label: 'Clients', icon: User },
    { id: 'deals', label: 'Deals', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Enhanced dashboard stats
  const getDashboardStats = () => {
    const activeDeals = deals.filter(d => d.status === 'active');
    const completedDeals = deals.filter(d => d.status === 'completed');
    const pendingTasks = tasks.filter(t => !t.completed);
    const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
    
    const totalDealsValue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const avgHealthScore = clients.length > 0 
      ? Math.round(clients.reduce((sum, client) => sum + (client.healthScore || 75), 0) / clients.length)
      : 75;

    return {
      totalClients: clients.length,
      totalLeads: leads.length,
      activeDeals: activeDeals.length,
      pendingTasks: pendingTasks.length,
      highPriorityTasks: highPriorityTasks.length,
      totalDealsValue,
      avgHealthScore,
      recentCommunications: communications.slice(0, 5),
      completedDeals: completedDeals.length
    };
  };

  const stats = getDashboardStats();

  // Filter clients based on search and filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = clientFilter === 'all' || 
      client.type === clientFilter ||
      (client.activeRoles && Object.keys(client.activeRoles).includes(clientFilter));
    
    return matchesSearch && matchesFilter;
  });

  const filteredLeads = leads.filter(lead => {
    return searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your CRM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">MyImoMate CRM</h1>
          <p className="text-sm text-gray-500">Real Estate Management</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                    {item.id === 'leads' && leads.length > 0 && (
                      <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {leads.length}
                      </span>
                    )}
                    {item.id === 'tasks' && stats.pendingTasks > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {stats.pendingTasks}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 mb-2">Account Status</div>
          <div className={`px-3 py-2 rounded-lg text-sm ${
            subscriptionStatus === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {subscriptionStatus === 'active' ? '✓ Pro Plan' : '⚡ Basic Plan'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                {activeView}
              </h2>
              
              {(activeView === 'clients' || activeView === 'leads') && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              {stats.highPriorityTasks > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.highPriorityTasks}
                  </span>
                </div>
              )}

              {/* Subscription Status (Pro users only) */}
              {subscriptionStatus && (
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscriptionStatus === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscriptionStatus === 'active' ? 'Pro Plan' : 'Basic Plan'}
                  </span>
                </div>
              )}

              {/* Add New Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(userProfile?.name || user?.displayName || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {userProfile?.name || user?.displayName || 'User'}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
                      <div className="p-4 border-b">
                        <div className="text-sm font-medium text-gray-900">
                          {userProfile?.name || user?.displayName || 'User'}
                        </div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                        {userProfile?.company && (
                          <div className="text-xs text-gray-500">{userProfile.company}</div>
                        )}
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileSettings(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="inline h-4 w-4 mr-2" />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            setShowAccountSettings(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="inline h-4 w-4 mr-2" />
                          Account Settings
                        </button>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeView === 'dashboard' && <EnhancedDashboardView />}
          {activeView === 'leads' && <LeadsView />}
          {activeView === 'clients' && <EnhancedClientsView />}
          {activeView === 'deals' && <DealsView />}
          {activeView === 'tasks' && <TasksView />}
          {activeView === 'calendar' && <CalendarView />}
        </div>
      </div>

      {/* Modals - REPLACE QuickAddForm with ExpandedClientForm */}
      {showAddForm && (
        <ExpandedClientForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleExpandedClientSubmit}
          formType={formType}
          setFormType={setFormType}
        />
      )}
      <ProfileSettings 
        isOpen={showProfileSettings} 
        onClose={() => setShowProfileSettings(false)} 
      />
      <AccountSettings 
        isOpen={showAccountSettings} 
        onClose={() => setShowAccountSettings(false)} 
      />
    </div>
  );

  // REST OF YOUR EXISTING FUNCTIONS STAY THE SAME...
  // (All your existing view functions, components, etc.)

  // Enhanced Dashboard View
  function EnhancedDashboardView() {
    return (
      <div className="space-y-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
            color="blue"
            subtitle={`Avg. Health: ${stats.avgHealthScore}%`}
          />
          <StatCard
            title="Active Deals"
            value={stats.activeDeals}
            icon={Target}
            color="green"
            subtitle={`€${stats.totalDealsValue.toLocaleString()}`}
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={FileText}
            color="orange"
            subtitle={`${stats.highPriorityTasks} high priority`}
          />
          <StatCard
            title="New Leads"
            value={stats.totalLeads}
            icon={TrendingUp}
            color="purple"
            subtitle="This month"
          />
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            {stats.recentCommunications.length > 0 ? (
              <div className="space-y-3">
                {stats.recentCommunications.map((comm, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{comm.type}</div>
                      <div className="text-xs text-gray-500">{comm.content}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(comm.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <HandHeart className="h-5 w-5 mr-2 text-green-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveView('clients')}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
              >
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium text-blue-800">View Clients</div>
              </button>
              <button
                onClick={() => setActiveView('leads')}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
              >
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium text-green-800">Manage Leads</div>
              </button>
              <button
                onClick={() => setActiveView('deals')}
                className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
              >
                <Target className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium text-orange-800">Track Deals</div>
              </button>
              <button
                onClick={() => setActiveView('tasks')}
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
              >
                <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium text-purple-800">Manage Tasks</div>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedDeals}</div>
              <div className="text-sm text-gray-600">Completed Deals</div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeDeals > 0 ? Math.round((stats.completedDeals / (stats.activeDeals + stats.completedDeals)) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="text-xs text-gray-500">Deals closed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">€{Math.round(stats.totalDealsValue / 1000)}K</div>
              <div className="text-sm text-gray-600">Pipeline Value</div>
              <div className="text-xs text-gray-500">Active deals</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Clients View
  function EnhancedClientsView() {
  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 items-center">
            <select 
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Clients</option>
              <option value="buyer">Buyers</option>
              <option value="seller">Sellers</option>
              <option value="landlord">Landlords</option>
              <option value="tenant">Tenants</option>
              <option value="investor">Investors</option>
            </select>
            
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <SimpleClientCard
            key={client.id}
            client={client}
            clientStats={getClientStats ? getClientStats(client.id) : null}
            onUpdateStage={updateClientStage}
            onAddRole={addClientRole}
            onViewDetails={(client) => {
              console.log('View details for:', client.name);
            }}
            onLogCommunication={(client) => {
              if (logCommunication) {
                logCommunication({
                  clientId: client.id,
                  type: 'call',
                  content: `Called ${client.name}`,
                  direction: 'outbound'
                });
              }
            }}
            onEditClient={(clientId, updates) => {
              updateClient(clientId, updates);
            }}
            onCreateDeal={(client) => {
              if (createDeal) {
                createDeal({
                  clientId: client.id,
                  type: 'property_transaction',
                  stage: 'initial',
                  value: 0,
                  probability: 50
                });
              }
            }}
            // 🔧 CRITICAL: Fixed deal management props
            onSaveDeal={handleSaveDeal}
            onDeleteDeal={handleDeleteDeal}
            onDeleteClient={(clientId) => deleteClient(clientId)}
            deals={deals} // 🎯 CRITICAL: Pass the deals array from useFirebaseData
          />
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchTerm || clientFilter !== 'all' 
              ? 'No clients match your search criteria'
              : 'No clients yet. Add your first client to get started!'}
          </p>
        </div>
      )}
    </div>
  );
}

  // Leads View
  function LeadsView() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchTerm 
                ? 'No leads match your search criteria'
                : 'No leads yet. Start capturing leads to grow your business!'}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Deals View
  function DealsView() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} clients={clients} />
          ))}
        </div>

        {deals.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No active deals. Create your first deal to start tracking!</p>
          </div>
        )}
      </div>
    );
  }

  // Tasks View
  function TasksView() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No tasks yet. Add your first task to stay organized!</p>
          </div>
        )}
      </div>
    );
  }

  // Calendar View
  function CalendarView() {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
        <p className="text-gray-500">Calendar integration coming soon!</p>
      </div>
    );
  }

  function LeadCard({ lead }) {
    return (
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-600">{lead.email}</p>
            <p className="text-sm text-gray-600">{lead.phone}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            lead.type === 'buyer' ? 'bg-blue-100 text-blue-800' : 
            lead.type === 'seller' ? 'bg-green-100 text-green-800' : 
            lead.type === 'landlord' ? 'bg-orange-100 text-orange-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {lead.type}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">From: {lead.source}</span>
          <div className="space-x-2">
            <button 
              onClick={() => convertLeadToClient(lead)}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Convert
            </button>
          </div>
        </div>
      </div>
    );
  }

  function DealCard({ deal, clients }) {
    const client = clients.find(c => c.id === deal.clientId);
    const progressPercentage = Math.min(deal.probability || 50, 100);

    return (
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              {deal.type?.replace('_', ' ') || 'Property Deal'}
            </h3>
            <p className="text-sm text-gray-600">{client?.name || 'Unknown Client'}</p>
            <p className="text-xs text-gray-500">
              Created: {new Date(deal.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="text-lg font-bold text-green-600">
            €{deal.value?.toLocaleString() || '0'}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center text-sm mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            deal.stage === 'initial' ? 'bg-blue-100 text-blue-800' :
            deal.stage === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
            deal.stage === 'closing' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {deal.stage}
          </span>
        </div>
      </div>
    );
  }

  function TaskCard({ task }) {
    return (
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            {task.dueDate && (
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.priority}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {task.completed ? 'Completed' : 'Pending'}
          </span>
          <button
            onClick={() => completeTask(task.id)}
            disabled={task.completed}
            className={`px-3 py-1 text-xs rounded ${
              task.completed 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {task.completed ? 'Done' : 'Complete'}
          </button>
        </div>
      </div>
    );
  }
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default SimplifiedCRM;