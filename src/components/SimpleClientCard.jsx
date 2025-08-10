// 🎯 FIXED SimpleClientCard.jsx - Edit Button Issue Fixed
import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Euro, 
  Target,
  Eye,
  MessageCircle,
  Home,
  Building,
  Key,
  DollarSign,
  Plus,
  X,
  Edit,
  Trash2
} from 'lucide-react';

// Import the new ClientOverview component
import ClientOverview from './client/ClientOverview';
import InvestorDealModal from './InvestorDealModal';

// 🎯 MAIN COMPONENT: Simple Client Card (just essential info)
const SimpleClientCard = ({ 
  client, 
  deals = [],
  onSaveDeal,
  onDeleteDeal,
  onEditClient,
  onDeleteClient,
  onAddRole 
}) => {
  console.log("🎯 NEW ENHANCED SIMPLECLIENTCARD IS RUNNING!");
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get primary role and deal count
  const activeRoles = client.activeRoles || {};
  const primaryRole = client.type || Object.keys(activeRoles)[0] || 'buyer';
  const totalDeals = deals.filter(deal => deal.clientId === client.id).length;

  const roleIcons = {
    buyer: Home,
    seller: Building,
    landlord: Building,
    tenant: Key,
    investor: DollarSign
  };

  const PrimaryIcon = roleIcons[primaryRole] || User;

  return (
    <>
      {/* 🎯 SIMPLE CARD: Just click to open detailed view */}
      <div 
        onClick={() => setShowDetailModal(true)}
        className="bg-white rounded-lg border p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      >
        {/* Header with avatar and name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {client.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
            <p className="text-sm text-gray-600 truncate">{client.email}</p>
          </div>
          {client.healthScore && (
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">{client.healthScore}%</div>
            </div>
          )}
        </div>

        {/* Primary role and deals info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PrimaryIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700 capitalize">{primaryRole}</span>
            {Object.keys(activeRoles).length > 1 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                +{Object.keys(activeRoles).length - 1} roles
              </span>
            )}
          </div>
          
          {totalDeals > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{totalDeals}</span>
            </div>
          )}
        </div>

        {/* Hover indicator */}
        <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-500">Click to view details</span>
        </div>
      </div>

      {/* 🎯 DETAILED MODAL: All the complex stuff goes here */}
      {showDetailModal && (
        <ClientDetailModal
          client={client}
          deals={deals}
          onClose={() => setShowDetailModal(false)}
          onSaveDeal={onSaveDeal}
          onDeleteDeal={onDeleteDeal}
          onEditClient={onEditClient}
          onDeleteClient={onDeleteClient}
          onAddRole={onAddRole}
        />
      )}
    </>
  );
};

// 🎯 DETAILED MODAL: All complex features here
const ClientDetailModal = ({ 
  client, 
  deals, 
  onClose, 
  onSaveDeal, 
  onDeleteDeal, 
  onEditClient, 
  onDeleteClient, 
  onAddRole 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const activeRoles = client.activeRoles || {};
  const clientDeals = deals.filter(deal => deal.clientId === client.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'roles', label: 'Roles & Deals', icon: Target },
    { id: 'activity', label: 'Activity', icon: MessageCircle }
  ];

  // 🔧 FIXED: Handle edit mode properly
  const handleEditClick = () => {
    console.log("🔧 Edit button clicked - switching to edit mode");
    setIsEditing(true);
  };

  const handleSaveClient = (updatedClientData) => {
    console.log("💾 Saving client data:", updatedClientData);
    onEditClient(client.id, updatedClientData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    console.log("❌ Canceling edit mode");
    setIsEditing(false);
  };

  const handleDeleteClient = (clientId) => {
    console.log("🗑️ Deleting client:", clientId);
    onDeleteClient(clientId);
    onClose(); // Close modal after deletion
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <p className="text-blue-100">{client.email}</p>
                <p className="text-blue-100">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Show edit mode indicator */}
              {isEditing && (
                <div className="text-center">
                  <div className="text-sm font-bold text-yellow-200">EDITING</div>
                  <div className="text-xs text-blue-100">Edit Mode Active</div>
                </div>
              )}
              {client.healthScore && !isEditing && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{client.healthScore}%</div>
                  <div className="text-sm text-blue-100">Health Score</div>
                </div>
              )}
              <button 
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsEditing(false); // Reset edit mode when switching tabs
                  }}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
                  {isEditing && tab.id === 'overview' && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                      EDITING
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <>
              {!isEditing ? (
                <ClientOverview 
                  client={client} 
                  deals={clientDeals}
                  onEditClient={handleEditClick}  // ✅ FIXED: Pass the correct handler
                  onDeleteClient={handleDeleteClient}
                />
              ) : (
                <SimpleEditForm 
                  client={client}
                  onSave={handleSaveClient}
                  onCancel={handleCancelEdit}
                />
              )}
            </>
          )}
          
          {activeTab === 'roles' && (
            <RolesDealsTab 
              client={client}
              activeRoles={activeRoles}
              deals={clientDeals}
              onAddRole={onAddRole}
              onSaveDeal={onSaveDeal}
              onDeleteDeal={onDeleteDeal}
              showInvestorModal={() => setShowInvestorModal(true)}
            />
          )}
          
          {activeTab === 'activity' && (
            <ActivityTab client={client} />
          )}
        </div>
      </div>

      {/* Investor Modal */}
      {showInvestorModal && (
        <InvestorDealModal
          client={client}
          isOpen={showInvestorModal}
          onClose={() => setShowInvestorModal(false)}
          onSaveDeal={onSaveDeal}
        />
      )}
    </div>
  );
};

// 🎯 SIMPLE EDIT FORM (Enhanced with better styling)
const SimpleEditForm = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    notes: client.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 Form submitted with data:", formData);
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200 bg-yellow-50">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Client Information</h3>
            <p className="text-sm text-gray-600 mt-1">Update basic client information. Comprehensive editing coming soon!</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Additional notes about this client..."
          />
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Edit className="w-4 h-4" />
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// 🎯 ROLES & DEALS TAB (unchanged)
const RolesDealsTab = ({ 
  client, 
  activeRoles, 
  deals, 
  onAddRole, 
  onSaveDeal, 
  onDeleteDeal, 
  showInvestorModal 
}) => {
  const roleConfig = {
    buyer: { name: 'Buyer', icon: Home, color: 'bg-blue-100 text-blue-800' },
    seller: { name: 'Seller', icon: Building, color: 'bg-green-100 text-green-800' },
    landlord: { name: 'Landlord', icon: Building, color: 'bg-orange-100 text-orange-800' },
    tenant: { name: 'Tenant', icon: Key, color: 'bg-purple-100 text-purple-800' },
    investor: { name: 'Investor', icon: DollarSign, color: 'bg-indigo-100 text-indigo-800' }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Add Role Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Roles & Deals</h3>
        <button
          onClick={() => onAddRole && onAddRole(client.id, 'buyer', {})}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(activeRoles).map(([roleType, roleData]) => {
          const config = roleConfig[roleType] || roleConfig.buyer;
          const IconComponent = config.icon;
          const roleDeals = deals.filter(deal => 
            deal.roleType === roleType || deal.type === roleType
          );

          return (
            <div key={roleType} className="border rounded-lg p-4 bg-white">
              {/* Role Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{config.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  {roleDeals.length} deals
                </span>
              </div>

              {/* Role Info */}
              <div className="space-y-2 text-sm mb-4">
                {roleData.budget && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{formatCurrency(roleData.budget)}</span>
                  </div>
                )}
                {roleData.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{roleData.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage:</span>
                  <span className="font-medium capitalize">{roleData.stage || 'qualification'}</span>
                </div>
              </div>

              {/* Deals List */}
              {roleDeals.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-700">Recent Deals:</h4>
                  {roleDeals.slice(0, 2).map(deal => (
                    <div key={deal.id} className="bg-gray-50 p-2 rounded text-sm">
                      <div className="font-medium truncate">
                        {deal.propertyAddress || deal.title || 'Untitled Deal'}
                      </div>
                      <div className="text-gray-600">
                        {deal.propertyPrice ? formatCurrency(deal.propertyPrice) : 
                         deal.budget ? formatCurrency(deal.budget) : ''}
                      </div>
                    </div>
                  ))}
                  {roleDeals.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{roleDeals.length - 2} more deals
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => {
                  if (roleType === 'investor') {
                    showInvestorModal();
                  } else {
                    console.log('Open deals for', roleType);
                  }
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                {roleType === 'investor' ? '📊 Investment Analysis' : '📋 Manage Deals'}
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Show message if no roles */}
      {Object.keys(activeRoles).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No roles assigned yet</p>
          <p className="text-sm">Click "Add Role" to get started</p>
        </div>
      )}
    </div>
  );
};

// 🎯 ACTIVITY TAB (unchanged)
const ActivityTab = ({ client }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Activity tracking coming soon!</p>
        <p className="text-sm text-gray-400">This will show communication history, deal updates, and more.</p>
      </div>
    </div>
  );
};

export default SimpleClientCard;