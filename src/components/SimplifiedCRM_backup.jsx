// components/SimplifiedCRM.jsx - Complete version with Settings Integration
import React, { useState } from 'react';
import { Calendar, Users, Home, FileText, Bell, Plus, Search, Filter, Loader, User, Settings } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useAuth } from '../AuthContext';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';

const SimplifiedCRM = () => {
  const {
    leads,
    clients,
    tasks,
    loading,
    addLead,
    convertLeadToClient,
    addClient,
    updateClientStage,
    addTask,
    completeTask,
    deleteTask
  } = useFirebaseData();

  // Add authentication hook
  const { user, userProfile, subscriptionStatus, logout } = useAuth();

  const [activeView, setActiveView] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const clientStages = {
    buyer: ['qualification', 'visits', 'negotiating', 'cpcv', 'deed', 'completed'],
    seller: ['qualification', 'visits', 'negotiating', 'cpcv', 'deed', 'completed'],
    landlord: ['qualification', 'visits', 'negotiating', 'contract', 'completed'],
    tenant: ['qualification', 'visits', 'negotiating', 'contract', 'completed'],
    investor: ['qualification', 'visits', 'negotiating', 'cpcv', 'deed', 'completed']
  };

  // Add logout handler
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      qualification: 'bg-blue-100 text-blue-800',
      visits: 'bg-purple-100 text-purple-800',
      negotiating: 'bg-yellow-100 text-yellow-800',
      cpcv: 'bg-orange-100 text-orange-800',
      contract: 'bg-orange-100 text-orange-800',
      deed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-green-500 bg-green-50'
    };
    return colors[priority] || 'border-l-gray-500 bg-gray-50';
  };

  // Enhanced Header Component (inline for simplicity)
  const EnhancedHeader = () => {
    const getSubscriptionBadge = () => {
      if (!subscriptionStatus) return null;

      const badgeConfig = {
        trial: {
          color: 'bg-blue-100 text-blue-800',
          text: `Trial (${subscriptionStatus.daysLeft}d left)`
        },
        trial_expired: {
          color: 'bg-red-100 text-red-800',
          text: 'Trial Expired'
        },
        active: {
          color: 'bg-green-100 text-green-800',
          text: userProfile?.subscriptionPlan === 'pro' ? 'Pro Plan' : 'Normal Plan'
        },
        inactive: {
          color: 'bg-gray-100 text-gray-800',
          text: 'No Plan'
        }
      };

      const config = badgeConfig[subscriptionStatus.status];
      if (!config) return null;

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.text}
        </span>
      );
    };

    return (
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">MyImoMate CRM</h1>
              {getSubscriptionBadge()}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Client Usage */}
              {subscriptionStatus && (
                <div className="text-sm text-gray-600">
                  {subscriptionStatus.clientCount}/{subscriptionStatus.maxClients === 999999 ? '∞' : subscriptionStatus.maxClients} clients
                </div>
              )}

              {/* Add New Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
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

                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
                      {/* User Info */}
                      <div className="p-4 border-b">
                        <div className="text-sm font-medium text-gray-900">
                          {userProfile?.name || user?.displayName || 'User'}
                        </div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                        {userProfile?.company && (
                          <div className="text-xs text-gray-500">{userProfile.company}</div>
                        )}
                      </div>

                      {/* Subscription Info */}
                      {subscriptionStatus && (
                        <div className="p-3 border-b bg-gray-50">
                          <div className="text-sm font-medium text-gray-700">
                            {subscriptionStatus.status === 'trial' && 'Free Trial Active'}
                            {subscriptionStatus.status === 'trial_expired' && 'Trial Expired'}
                            {subscriptionStatus.status === 'active' && `${userProfile?.subscriptionPlan === 'pro' ? 'Pro' : 'Normal'} Plan Active`}
                            {subscriptionStatus.status === 'inactive' && 'No Active Plan'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {subscriptionStatus.status === 'trial' && `${subscriptionStatus.daysLeft} days remaining`}
                            {subscriptionStatus.status === 'trial_expired' && 'Upgrade to continue'}
                          </div>
                          {(subscriptionStatus.status === 'trial_expired' || subscriptionStatus.status === 'inactive') && (
                            <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded">
                              Upgrade Now
                            </button>
                          )}
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowProfileSettings(true);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Profile Settings
                        </button>
                        
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowAccountSettings(true);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </button>
                        
                        <hr className="my-2" />
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
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
      </div>
    );
  };

  const QuickAddForm = () => {
    const [formType, setFormType] = useState('lead');
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      type: 'buyer',
      source: 'website',
      notes: ''
    });

    const handleSubmit = async () => {
      if (!formData.name || !formData.phone) return;

      try {
        if (formType === 'lead') {
          await addLead(formData);
        } else {
          await addClient({ ...formData, stage: 'qualification' });
        }
        setShowAddForm(false);
        setFormData({ name: '', phone: '', email: '', type: 'buyer', source: 'website', notes: '' });
      } catch (error) {
        console.error('Error adding:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add New {formType === 'lead' ? 'Lead' : 'Client'}</h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setFormType('lead')}
                className={`px-3 py-1 rounded-md text-sm ${
                  formType === 'lead' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Lead
              </button>
              <button
                onClick={() => setFormType('client')}
                className={`px-3 py-1 rounded-md text-sm ${
                  formType === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Client
              </button>
            </div>
            
            <input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            
            <input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            
            <input
              placeholder="Email (optional)"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
              <option value="investor">Investor</option>
            </select>
            
            {formType === 'lead' && (
              <select
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social">Social Media</option>
                <option value="walk-in">Walk-in</option>
                <option value="phone">Phone Call</option>
              </select>
            )}
            
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border rounded-md h-20"
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {formType === 'lead' ? 'Lead' : 'Client'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LeadCard = ({ lead }) => (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-600">{lead.phone}</p>
          {lead.email && <p className="text-sm text-gray-500">{lead.email}</p>}
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
            Convert to Client
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
            Contact
          </button>
        </div>
      </div>
    </div>
  );

  const ClientCard = ({ client }) => (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{client.name}</h3>
          <p className="text-sm text-gray-600">{client.phone}</p>
          <p className="text-xs text-gray-500">
            Last contact: {client.lastContact ? client.lastContact.toLocaleDateString() : 'Never'}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          client.type === 'buyer' ? 'bg-blue-100 text-blue-800' : 
          client.type === 'seller' ? 'bg-green-100 text-green-800' : 
          client.type === 'landlord' ? 'bg-orange-100 text-orange-800' :
          client.type === 'investor' ? 'bg-indigo-100 text-indigo-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {client.type}
        </span>
      </div>
      
      <div className="mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(client.stage)}`}>
          {client.stage}
        </span>
      </div>
      
      <div className="flex space-x-2">
        <select
          value={client.stage}
          onChange={(e) => updateClientStage(client.id, e.target.value)}
          className="text-xs border rounded px-2 py-1"
        >
          {clientStages[client.type]?.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
          Contact
        </button>
      </div>
    </div>
  );

  const TaskCard = ({ task }) => (
    <div className={`border-l-4 ${getPriorityColor(task.priority)} rounded-lg p-4`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
            <span>Priority: {task.priority}</span>
            {task.dueDate && (
              <span>Due: {task.dueDate.toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button 
            onClick={() => completeTask(task.id)}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            Complete
          </button>
          <button 
            onClick={() => deleteTask(task.id)}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading your CRM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <EnhancedHeader />

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Home },
              { key: 'leads', label: `Leads (${leads.length})`, icon: Users },
              { key: 'clients', label: `Clients (${clients.length})`, icon: Users },
              { key: 'tasks', label: `Tasks (${tasks.filter(t => !t.completed).length})`, icon: FileText },
              { key: 'calendar', label: 'Calendar', icon: Calendar }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center px-3 py-4 border-b-2 text-sm font-medium ${
                  activeView === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'leads' && <LeadsView />}
        {activeView === 'clients' && <ClientsView />}
        {activeView === 'tasks' && <TasksView />}
        {activeView === 'calendar' && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Calendar view coming soon...</p>
          </div>
        )}
      </div>

      {/* Quick Add Modal */}
      {showAddForm && <QuickAddForm />}

      {/* Settings Modals */}
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

  // Dashboard View
  function DashboardView() {
    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{leads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(task => !task.completed).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(task => 
                    !task.completed && 
                    task.dueDate && 
                    task.dueDate.toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Recent Leads</h3>
            </div>
            <div className="p-6 space-y-4">
              {leads.slice(0, 3).map(lead => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
              {leads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No leads yet. Add some leads to get started!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Urgent Tasks</h3>
            </div>
            <div className="p-6 space-y-4">
              {tasks.filter(task => task.priority === 'high' && !task.completed).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasks.filter(task => task.priority === 'high' && !task.completed).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No urgent tasks. Great job staying on top of things!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Leads View
  function LeadsView() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Leads</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
          {leads.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-4">No leads yet</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Your First Lead
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Clients View
  function ClientsView() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Clients</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
          {clients.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-4">No clients yet</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Your First Client
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tasks View
  function TasksView() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <button 
            onClick={() => {
              // You can add a task creation modal here
              const taskTitle = prompt('Task title:');
              if (taskTitle) {
                addTask({
                  title: taskTitle,
                  priority: 'medium',
                  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                  completed: false
                });
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
        
        <div className="space-y-4">
          {tasks.filter(task => !task.completed).map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.filter(task => !task.completed).length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-4">No pending tasks</p>
              <p className="text-gray-400">You're all caught up! 🎉</p>
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {tasks.filter(task => task.completed).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Completed Tasks</h3>
            <div className="space-y-2">
              {tasks.filter(task => task.completed).map(task => (
                <div key={task.id} className="bg-gray-50 border rounded-lg p-4 opacity-60">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700 line-through">{task.title}</h4>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default SimplifiedCRM;