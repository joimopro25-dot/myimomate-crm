// components/EnhancedClientCard.jsx - Updated with Investor Deal Integration
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Euro, 
  Calendar, 
  Activity,
  Plus,
  Eye,
  MessageCircle,
  TrendingUp,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Home,
  Building,
  Key,
  DollarSign,
  X,
  Edit,
  Trash2
} from 'lucide-react';

// Import the new InvestorDealModal
import InvestorDealModal from './InvestorDealModal';

// Simple Profile Modal Component (existing - keeping the same)
const SimpleProfileModal = ({ client, isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    budget: '',
    location: ''
  });

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

  const handleSave = () => {
    onSave(client.id, formData);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{client.name} - Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {!isEditing ? (
            <div className="space-y-3">
              <div><strong>Name:</strong> {formData.name}</div>
              <div><strong>Email:</strong> {formData.email}</div>
              <div><strong>Phone:</strong> {formData.phone}</div>
              <div><strong>Budget:</strong> {formData.budget}</div>
              <div><strong>Location:</strong> {formData.location}</div>
              <div><strong>Notes:</strong> {formData.notes}</div>
              
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Name"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Email"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Phone"
              />
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Budget"
              />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Location"
              />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border rounded h-20"
                placeholder="Notes"
              />
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Role Deals Modal Component (for basic deals - non-investor)
const RoleDealsModal = ({ client, role, roleType, isOpen, onClose, onSaveDeal, onDeleteDeal, allDeals = [] }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [dealForm, setDealForm] = useState({
    title: '',
    budget: '',
    location: '',
    status: 'active',
    notes: ''
  });

  // Filter deals from Firebase for this client and role
  useEffect(() => {
    if (isOpen && client?.id && roleType && allDeals) {
      setLoading(true);
      
      // Filter deals for this specific client and role
      const clientRoleDeals = allDeals.filter(deal => 
        deal.clientId === client.id && 
        deal.roleType === roleType
      );
      
      setDeals(clientRoleDeals);
      setLoading(false);
    }
  }, [isOpen, client?.id, roleType, allDeals]);

  const handleSaveDeal = () => {
    const newDeal = {
      id: editingDeal?.id || Date.now().toString(),
      ...dealForm,
      createdAt: editingDeal?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingDeal) {
      const updatedDeals = deals.map(deal => 
        deal.id === editingDeal.id ? newDeal : deal
      );
      setDeals(updatedDeals);
    } else {
      setDeals([...deals, newDeal]);
    }

    onSaveDeal && onSaveDeal(client.id, roleType, newDeal);
    
    setDealForm({ title: '', budget: '', location: '', status: 'active', notes: '' });
    setIsAddingDeal(false);
    setEditingDeal(null);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setDealForm({
      title: deal.title || deal.propertyAddress || '',
      budget: deal.budget || deal.propertyPrice || '',
      location: deal.location || deal.propertyAddress || '',
      status: deal.status || 'active',
      notes: deal.notes || ''
    });
    setIsAddingDeal(true);
  };

  const handleDeleteDeal = (dealId) => {
    const updatedDeals = deals.filter(deal => deal.id !== dealId);
    setDeals(updatedDeals);
    onDeleteDeal && onDeleteDeal(client.id, roleType, dealId);
  };

  if (!isOpen) return null;

  const roleConfig = {
    buyer: { name: 'Buyer', icon: Home, color: 'text-blue-800' },
    seller: { name: 'Seller', icon: Building, color: 'text-green-800' },
    landlord: { name: 'Landlord', icon: Building, color: 'text-orange-800' },
    tenant: { name: 'Tenant', icon: Key, color: 'text-purple-800' },
    investor: { name: 'Investor', icon: DollarSign, color: 'text-indigo-800' }
  };

  const config = roleConfig[roleType] || roleConfig.buyer;
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IconComponent className="w-5 h-5" />
            <h3 className="text-lg font-semibold">{client.name} - {config.name} Deals</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading deals...</span>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {deals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No deals yet for this role</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first deal to get started</p>
                  </div>
                ) : (
                  deals.map(deal => (
                    <div key={deal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">
                            {deal.type === 'investor' ? 
                              (deal.propertyAddress || 'Investment Property') : 
                              (deal.title || 'Property Deal')
                            }
                          </h4>
                          
                          {deal.type === 'investor' ? (
                            // Display investor deal details
                            <div className="mt-2 space-y-1">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Strategy:</span> {deal.investmentType || 'Buy-to-Rent'}
                              </div>
                              {deal.propertyPrice && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Property Price:</span> €{parseInt(deal.propertyPrice).toLocaleString()}
                                </div>
                              )}
                              {deal.monthlyRent && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Monthly Rent:</span> €{deal.monthlyRent}
                                </div>
                              )}
                              {deal.returns && (
                                <div className="text-sm text-green-600 font-medium">
                                  ROI: {deal.returns.cashOnCashReturn?.toFixed(1) || 0}%
                                </div>
                              )}
                              {deal.score && (
                                <div className="text-sm">
                                  <span className={`font-medium ${
                                    deal.score.grade === 'A' ? 'text-green-600' :
                                    deal.score.grade === 'B' ? 'text-blue-600' :
                                    deal.score.grade === 'C' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    Investment Score: {deal.score.grade}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            // Display regular deal details
                            <div className="text-sm text-gray-600 mt-1">
                              {deal.budget && <span>Budget: {deal.budget}</span>}
                              {deal.location && <span className="ml-3">Location: {deal.location}</span>}
                            </div>
                          )}
                          
                          {deal.notes && (
                            <p className="text-sm text-gray-500 mt-2">{deal.notes}</p>
                          )}
                          
                          <div className="mt-3 flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              deal.status === 'active' ? 'bg-green-100 text-green-800' :
                              deal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {deal.status || 'active'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {deal.type === 'investor' ? 'Investment Analysis' : 'Standard Deal'}
                            </span>
                            <span className="text-xs text-gray-400">
                              Created: {new Date(deal.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditDeal(deal)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit Deal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete Deal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {isAddingDeal ? (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">
                {editingDeal ? 'Edit Deal' : 'Add New Deal'}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={dealForm.title}
                    onChange={(e) => setDealForm({...dealForm, title: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Deal title..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget</label>
                    <input
                      type="text"
                      value={dealForm.budget}
                      onChange={(e) => setDealForm({...dealForm, budget: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="€250,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={dealForm.status}
                      onChange={(e) => setDealForm({...dealForm, status: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={dealForm.location}
                    onChange={(e) => setDealForm({...dealForm, location: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Location preference..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={dealForm.notes}
                    onChange={(e) => setDealForm({...dealForm, notes: e.target.value})}
                    className="w-full p-2 border rounded h-20"
                    placeholder="Additional details..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsAddingDeal(false);
                      setEditingDeal(null);
                      setDealForm({ title: '', budget: '', location: '', status: 'active', notes: '' });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDeal}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    {editingDeal ? 'Update Deal' : 'Add Deal'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingDeal(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Deal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EnhancedClientCard = ({ 
  client, 
  onUpdateStage, 
  onAddRole, 
  onViewDetails, 
  onLogCommunication,
  clientStats,
  onCreateDeal,
  onEditClient,
  onSaveDeal,
  onDeleteDeal,
  deals = [] // NEW: Receive deals from parent
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRoleDeals, setShowRoleDeals] = useState(false);
  const [showInvestorDeals, setShowInvestorDeals] = useState(false); // NEW: Investor deals modal
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleType, setSelectedRoleType] = useState('');

  // Role configuration
  const roleConfig = {
    buyer: { 
      icon: Home, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      bgColor: 'bg-blue-50',
      name: 'Buyer' 
    },
    seller: { 
      icon: Building, 
      color: 'bg-green-100 text-green-800 border-green-200',
      bgColor: 'bg-green-50',
      name: 'Seller' 
    },
    landlord: { 
      icon: Building, 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      bgColor: 'bg-orange-50',
      name: 'Landlord' 
    },
    tenant: { 
      icon: Key, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      bgColor: 'bg-purple-50',
      name: 'Tenant' 
    },
    investor: { 
      icon: DollarSign, 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      bgColor: 'bg-indigo-50',
      name: 'Investor' 
    }
  };

  const stageConfig = {
    qualification: { color: 'bg-blue-100 text-blue-800', name: 'Qualification' },
    visits: { color: 'bg-purple-100 text-purple-800', name: 'Property Visits' },
    negotiating: { color: 'bg-yellow-100 text-yellow-800', name: 'Negotiating' },
    cpcv: { color: 'bg-orange-100 text-orange-800', name: 'CPCV' },
    contract: { color: 'bg-orange-100 text-orange-800', name: 'Contract' },
    deed: { color: 'bg-green-100 text-green-800', name: 'Deed' },
    completed: { color: 'bg-green-100 text-green-800', name: 'Completed' }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else {
      return 'Invalid date';
    }
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };

  // NEW: Handle role click - different behavior for investor vs others
  const handleRoleClick = (roleType, roleData) => {
    setSelectedRole(roleData);
    setSelectedRoleType(roleType);
    
    if (roleType === 'investor') {
      setShowInvestorDeals(true); // Open investor-specific modal
    } else {
      setShowRoleDeals(true); // Open regular deals modal
    }
  };

  // Safely handle activeRoles and ensure data integrity
  const activeRoles = client.activeRoles || {};
  const primaryRole = client.type || Object.keys(activeRoles)[0] || 'buyer';
  const hasMultipleRoles = Object.keys(activeRoles).length > 1;

  const displayRoles = Object.keys(activeRoles).length > 0 
    ? activeRoles 
    : { [client.type || 'buyer']: { stage: client.stage || 'qualification' }};

  return (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-all duration-200">
      <div className="p-4">
        {/* Client Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {client.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {client.healthScore && (
            <div className="text-right">
              <div className={`text-2xl font-bold ${getHealthScoreColor(client.healthScore)}`}>
                {client.healthScore}%
              </div>
              <div className="text-xs text-gray-500">Health Score</div>
            </div>
          )}
        </div>

        {/* Roles Section */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(displayRoles).map(([roleType, roleData]) => {
              const config = roleConfig[roleType] || roleConfig.buyer;
              const IconComponent = config.icon;
              const stage = stageConfig[roleData.stage] || stageConfig.qualification;
              
              return (
                <div
                  key={roleType}
                  onClick={() => handleRoleClick(roleType, roleData)} // NEW: Click handler
                  className={`border rounded-lg p-3 min-w-[120px] cursor-pointer hover:shadow-md transition-all ${config.color} hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium text-sm">{config.name}</span>
                    <Target className="w-3 h-3 ml-auto" title="Click to view deals" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${stage.color}`}>
                      {stage.name}
                    </span>
                    
                    {roleData.budget && (
                      <div className="flex items-center gap-1 text-xs">
                        <Euro className="w-3 h-3" />
                        <span>{roleData.budget}</span>
                      </div>
                    )}
                    
                    {roleData.location && (
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{roleData.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Add Role Button */}
            {onAddRole && (
              <button
                onClick={() => setShowAddRole(true)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center hover:border-gray-400 transition-colors min-w-[120px] text-gray-600 hover:text-gray-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="text-sm">Add Role</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {clientStats && (
          <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{clientStats.activeDeals}</div>
              <div className="text-xs text-gray-500">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{clientStats.completedDeals}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{clientStats.pendingTasks}</div>
              <div className="text-xs text-gray-500">Pending Tasks</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">
                {formatCurrency(clientStats.lifetimeValue)}
              </div>
              <div className="text-xs text-gray-500">Lifetime Value</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? 'Less' : 'Details'}
          </button>
          
          <button
            onClick={() => onLogCommunication && onLogCommunication(client)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Contact
          </button>
          
          <button
            onClick={() => onCreateDeal && onCreateDeal(client)}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
          >
            <Target className="w-4 h-4" />
            New Deal
          </button>
          
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            Profile
          </button>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Last Contact:</span>
                <span className="ml-2 font-medium">{formatDate(client.lastContact)}</span>
              </div>
              <div>
                <span className="text-gray-500">Client Since:</span>
                <span className="ml-2 font-medium">{formatDate(client.createdAt)}</span>
              </div>
            </div>
            
            {client.notes && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-800 mb-1">Notes:</div>
                <div className="text-sm text-yellow-700">{client.notes}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddRole && (
        <AddRoleModal
          client={client}
          onClose={() => setShowAddRole(false)}
          onAddRole={onAddRole}
          existingRoles={Object.keys(activeRoles)}
        />
      )}

      <SimpleProfileModal
        client={client}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={onEditClient}
      />

      {/* Regular Role Deals Modal */}
      <RoleDealsModal
        client={client}
        role={selectedRole}
        roleType={selectedRoleType}
        isOpen={showRoleDeals}
        onClose={() => setShowRoleDeals(false)}
        onSaveDeal={onSaveDeal}
        onDeleteDeal={onDeleteDeal}
        allDeals={deals} // NEW: Pass all deals for filtering
      />

      {/* NEW: Investor Deals Modal */}
      <InvestorDealModal
        client={client}
        isOpen={showInvestorDeals}
        onClose={() => setShowInvestorDeals(false)}
        onSaveDeal={onSaveDeal}
        allDeals={deals} // NEW: Pass all deals for filtering
      />
    </div>
  );
};

// Add Role Modal Component (keeping the same)
const AddRoleModal = ({ client, onClose, onAddRole, existingRoles }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [roleData, setRoleData] = useState({
    budget: '',
    location: '',
    urgency: 'medium',
    preferences: ''
  });

  const availableRoles = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'landlord', label: 'Landlord' },
    { value: 'tenant', label: 'Tenant' },
    { value: 'investor', label: 'Investor' }
  ].filter(role => !existingRoles.includes(role.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole && onAddRole) {
      onAddRole(client.id, selectedRole, roleData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add New Role for {client.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Type
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select a role...</option>
              {availableRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget
            </label>
            <input
              type="text"
              value={roleData.budget}
              onChange={(e) => setRoleData({...roleData, budget: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., €250,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Preference
            </label>
            <input
              type="text"
              value={roleData.location}
              onChange={(e) => setRoleData({...roleData, location: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., Vila Nova de Famalicão"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <select
              value={roleData.urgency}
              onChange={(e) => setRoleData({...roleData, urgency: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="low">Low - Looking casually</option>
              <option value="medium">Medium - Actively searching</option>
              <option value="high">High - Urgent need</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes/Preferences
            </label>
            <textarea
              value={roleData.preferences}
              onChange={(e) => setRoleData({...roleData, preferences: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="Additional requirements or preferences..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRole}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedClientCard;