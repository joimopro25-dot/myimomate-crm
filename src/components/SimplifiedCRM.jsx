// components/SimplifiedCRM.jsx - Fixed Enhanced version (replace your current file)
import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData'; // Keep same import name
import { useAuth } from '../AuthContext';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import EnhancedClientCard from './EnhancedClientCard';

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
      ? Math.round(clients.reduce((sum, client) => sum + (client.healthScore || 50), 0) / clients.length)
      : 50;

    return {
      totalClients: clients.length,
      newLeads: leads.length,
      activeDeals: activeDeals.length,
      completedDeals: completedDeals.length,
      pendingTasks: pendingTasks.length,
      highPriorityTasks: highPriorityTasks.length,
      totalDealsValue,
      avgHealthScore,
      totalCommunications: communications.length
    };
  };

  const stats = getDashboardStats();

  // Filter clients based on search and filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (clientFilter === 'all') return matchesSearch;
    
    // Filter by role (enhanced version)
    if (client.activeRoles && client.activeRoles[clientFilter]) return matchesSearch;
    
    // Backward compatibility - check old type field
    return matchesSearch && client.type === clientFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">MyImoMate CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Enhanced Edition</p>
        </div>
        
        <div className="px-3">
          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeView === id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
                {id === 'deals' && deals.filter(d => d.status === 'active').length > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {deals.filter(d => d.status === 'active').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {activeView}
              </h2>
              {activeView === 'dashboard' && (
                <p className="text-sm text-gray-500">
                  Overview of your real estate business
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Subscription Status */}
              {subscriptionStatus && (
                <div className="text-sm text-gray-600">
                  {subscriptionStatus.status === 'trial' && (
                    <span className="text-orange-600">
                      Trial: {subscriptionStatus.clientCount}/{subscriptionStatus.maxClients} clients
                    </span>
                  )}
                  {subscriptionStatus.status === 'active' && (
                    <span className="text-green-600">
                      {userProfile?.subscriptionPlan === 'pro' ? 'Pro Plan' : 'Basic Plan'}
                    </span>
                  )}
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

      {/* Modals */}
      {showAddForm && <QuickAddForm />}
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
            subtitle={`Avg. Health Score: ${stats.avgHealthScore}%`}
          />
          
          <StatCard
            title="Active Deals"
            value={stats.activeDeals}
            icon={Target}
            color="green"
            subtitle={`€${(stats.totalDealsValue / 1000).toFixed(0)}K total value`}
          />
          
          <StatCard
            title="New Leads"
            value={stats.newLeads}
            icon={HandHeart}
            color="purple"
            subtitle="Ready for conversion"
          />
          
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={Clock}
            color="orange"
            subtitle={`${stats.highPriorityTasks} high priority`}
          />
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {communications.slice(0, 5).map(comm => (
                <div key={comm.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{comm.type?.replace('_', ' ') || 'Activity'}</span>
                    {comm.clientId && (
                      <span className="text-gray-500 ml-2">
                        with {clients.find(c => c.id === comm.clientId)?.name || 'Unknown'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400">
                    {new Date(comm.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {communications.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Clients
            </h3>
            <div className="space-y-3">
              {clients
                .sort((a, b) => (b.healthScore || 50) - (a.healthScore || 50))
                .slice(0, 5)
                .map(client => {
                  const clientStats = getClientStats ? getClientStats(client.id) : null;
                  return (
                    <div key={client.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">
                          {Object.keys(client.activeRoles || {[client.type || 'buyer']: {}}).join(', ')} • 
                          {clientStats?.activeDeals || 0} deals
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {client.healthScore || 50}%
                        </div>
                        <div className="text-xs text-gray-500">Health Score</div>
                      </div>
                    </div>
                  );
                })}
              {clients.length === 0 && (
                <p className="text-gray-500 text-center py-4">No clients yet</p>
              )}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search clients by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
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
            <EnhancedClientCard
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
            />
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchTerm || clientFilter !== 'all' 
                ? 'No clients match your search criteria'
                : 'No clients yet. Add your first client to get started!'
              }
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
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Active Deals</h3>
              <p className="text-sm text-gray-500">
                Track your property transactions and investments
              </p>
            </div>
            <button
              onClick={() => {
                console.log('Create new deal');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              New Deal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {deals.filter(deal => deal.status === 'active').map(deal => (
            <DealCard key={deal.id} deal={deal} clients={clients} />
          ))}
        </div>

        {deals.filter(deal => deal.status === 'active').length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              No active deals. Create your first deal to track progress!
            </p>
          </div>
        )}
      </div>
    );
  }

  // Other view functions...
  function LeadsView() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Active Leads</h3>
              <p className="text-sm text-gray-500">Convert prospects into clients</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>

        {leads.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <HandHeart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No leads yet. Start capturing prospects!</p>
          </div>
        )}
      </div>
    );
  }

  function TasksView() {
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
              <p className="text-sm text-gray-500">
                {pendingTasks.length} pending • {completedTasks.length} completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium text-gray-900 mb-4">Pending Tasks</h4>
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">All caught up! No pending tasks.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  function CalendarView() {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Calendar integration coming soon...</p>
      </div>
    );
  }

  // Component functions...
  function LeadCard({ lead }) {
    return (
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-600">{lead.phone}</p>
            <p className="text-xs text-gray-500">
              Added: {new Date(lead.createdAt).toLocaleDateString()}
            </p>
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
            {deal.stage || 'Initial'}
          </span>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
            Update
          </button>
        </div>
      </div>
    );
  }

  function TaskCard({ task }) {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return 'border-red-300 bg-red-50';
        case 'medium': return 'border-yellow-300 bg-yellow-50';
        case 'low': return 'border-green-300 bg-green-50';
        default: return 'border-gray-300 bg-gray-50';
      }
    };

    return (
      <div className={`border-l-4 rounded-lg p-4 ${getPriorityColor(task.priority)} ${
        task.completed ? 'opacity-60' : ''
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            {task.clientName && (
              <p className="text-sm text-gray-600">Client: {task.clientName}</p>
            )}
            <p className="text-xs text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!task.completed && (
              <button 
                onClick={() => completeTask(task.id)}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Complete
              </button>
            )}
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
  }

  // Quick Add Form
  function QuickAddForm() {
    const [formType, setFormType] = useState('lead');
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      type: 'buyer',
      source: 'website',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formType === 'lead') {
        addLead(formData);
      } else {
        addClient(formData);
      }
      setShowAddForm(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        type: 'buyer',
        source: 'website',
        notes: ''
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Add New</h3>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFormType('lead')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                formType === 'lead' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lead
            </button>
            <button
              onClick={() => setFormType('client')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                formType === 'client' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Client
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
                <option value="investor">Investor</option>
              </select>
            </div>

            {formType === 'lead' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social Media</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="walk-in">Walk-in</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional information..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add {formType === 'lead' ? 'Lead' : 'Client'}
              </button>
            </div>
          </form>
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