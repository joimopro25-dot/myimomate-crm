// components/EnhancedClientCard.jsx - Simple version to avoid import issues
import React, { useState } from 'react';
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
  DollarSign
} from 'lucide-react';

const EnhancedClientCard = ({ 
  client, 
  onUpdateStage, 
  onAddRole, 
  onViewDetails, 
  onLogCommunication,
  clientStats,
  onCreateDeal 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

  // Safety check - if no client data, return null
  if (!client || !client.name) {
    console.warn('EnhancedClientCard: Invalid client data received', client);
    return null;
  }

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
    
    // Handle different date formats
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else if (date.toDate && typeof date.toDate === 'function') {
      // Firebase Timestamp
      dateObj = date.toDate();
    } else {
      return 'Invalid date';
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };

  // Safely handle activeRoles and ensure data integrity
  const activeRoles = client.activeRoles || {};
  const primaryRole = client.type || Object.keys(activeRoles)[0] || 'buyer';
  const hasMultipleRoles = Object.keys(activeRoles).length > 1;

  // If no activeRoles but has old format, create compatible display
  const displayRoles = Object.keys(activeRoles).length > 0 
    ? activeRoles 
    : { 
        [client.type || 'buyer']: { 
          stage: client.stage || 'qualification', 
          budget: client.budget || '', 
          location: client.location || '', 
          urgency: 'medium',
          lastActivity: client.lastContact || new Date()
        } 
      };

  return (
    <div className="bg-white border rounded-lg hover:shadow-lg transition-all duration-200">
      {/* Main Card Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
              {hasMultipleRoles && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {Object.keys(activeRoles).length} roles
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              {client.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{client.email}</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              Last contact: {formatDate(client.lastContact)}
            </div>
          </div>

        {/* Health Score */}
        {clientStats && clientStats.healthScore !== undefined && (
          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthScoreColor(clientStats.healthScore)}`}>
              {clientStats.healthScore}
            </div>
            <div className="text-xs text-gray-500">Health Score</div>
          </div>
        )}
        </div>

        {/* Roles Display */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {Object.entries(displayRoles).map(([roleType, roleData]) => {
              const config = roleConfig[roleType] || roleConfig.buyer;
              const IconComponent = config.icon;
              const stage = stageConfig[roleData.stage] || stageConfig.qualification;
              
              return (
                <div key={roleType} className={`border rounded-lg p-2 ${config.color} flex-1 min-w-[120px]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium text-sm">{config.name}</span>
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
            onClick={() => onViewDetails && onViewDetails(client)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            Profile
          </button>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t pt-4 space-y-4">
            {/* Role Management */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Role Management
              </h4>
              
              <div className="space-y-2">
                {Object.entries(displayRoles).map(([roleType, roleData]) => {
                  const config = roleConfig[roleType] || roleConfig.buyer;
                  const stages = getStagesForRole(roleType);
                  
                  return (
                    <div key={roleType} className={`p-3 rounded-lg border ${config.bgColor}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <config.icon className="w-4 h-4" />
                          <span className="font-medium">{config.name}</span>
                        </div>
                        <select
                          value={roleData.stage}
                          onChange={(e) => onUpdateStage && onUpdateStage(client.id, e.target.value, roleType)}
                          className="text-sm border rounded px-2 py-1 bg-white"
                        >
                          {stages.map(stage => (
                            <option key={stage} value={stage}>
                              {stageConfig[stage]?.name || stage}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <span className="ml-1 font-medium">{roleData.budget || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-1 font-medium">{roleData.location || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Urgency:</span>
                          <span className="ml-1 font-medium capitalize">{roleData.urgency || 'Medium'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Activity:</span>
                          <span className="ml-1 font-medium">
                            {formatDate(roleData.lastActivity || client.lastContact)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Client Notes */}
            {client.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  {client.notes}
                </div>
              </div>
            )}

            {/* Communication History Preview */}
            {clientStats && clientStats.totalCommunications > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Recent Activity
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Total communications: {clientStats.totalCommunications}</span>
                    <span className="text-gray-500">
                      Last: {formatDate(clientStats.lastCommunication)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Indicators */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance Indicators
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <span className={`text-sm font-medium ${getHealthScoreColor(client.healthScore || 50)}`}>
                      {client.healthScore || 50}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (client.healthScore || 50) >= 80 ? 'bg-green-500' :
                        (client.healthScore || 50) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${client.healthScore || 50}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Relationship</span>
                    <span className="text-sm font-medium capitalize">
                      {client.relationshipStrength || 'New'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {clientStats ? `${clientStats.activeRolesCount || 1} active role(s)` : '1 active role'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      {showAddRole && (
        <AddRoleModal
          client={client}
          onClose={() => setShowAddRole(false)}
          onAddRole={onAddRole}
          existingRoles={Object.keys(activeRoles)}
        />
      )}
    </div>
  );
};

// Helper function to get stages for a specific role
const getStagesForRole = (roleType) => {
  const stageMap = {
    buyer: ['qualification', 'visits', 'negotiating', 'cpcv', 'deed', 'completed'],
    seller: ['qualification', 'visits', 'negotiating', 'cpcv', 'deed', 'completed'],
    landlord: ['qualification', 'visits', 'negotiating', 'contract', 'completed'],
    tenant: ['qualification', 'visits', 'negotiating', 'contract', 'completed'],
    investor: ['qualification', 'visits', 'negotiating', 'cpcv', 'deed', 'completed']
  };
  
  return stageMap[roleType] || stageMap.buyer;
};

// Add Role Modal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Add Role for {client.name}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Choose a role...</option>
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
              placeholder="e.g., €200k-300k"
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
              placeholder="e.g., Porto, Matosinhos"
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