// utils/clientTypes.js
export const clientTypes = {
  buyer: {
    label: 'Buyer',
    icon: '🏠',
    color: 'bg-blue-100 text-blue-800',
    description: 'Looking to purchase property',
    defaultStage: 'qualification',
    commonTasks: [
      'Property search consultation',
      'Schedule property viewing',
      'Prepare mortgage pre-approval',
      'Market analysis review',
      'Offer preparation'
    ]
  },
  seller: {
    label: 'Seller',
    icon: '🏘️',
    color: 'bg-green-100 text-green-800',
    description: 'Looking to sell property',
    defaultStage: 'qualification',
    commonTasks: [
      'Property evaluation',
      'Market analysis',
      'Photography session',
      'Marketing plan',
      'Listing preparation'
    ]
  },
  landlord: {
    label: 'Landlord',
    icon: '🏢',
    color: 'bg-orange-100 text-orange-800',
    description: 'Property owner for rental',
    defaultStage: 'qualification',
    commonTasks: [
      'Rental market analysis',
      'Property preparation',
      'Marketing to tenants',
      'Tenant screening',
      'Lease preparation'
    ]
  },
  tenant: {
    label: 'Tenant',
    icon: '🔑',
    color: 'bg-purple-100 text-purple-800',
    description: 'Looking to rent property',
    defaultStage: 'qualification',
    commonTasks: [
      'Requirements consultation',
      'Property viewings',
      'Application processing',
      'Reference checks',
      'Move-in coordination'
    ]
  },
  investor: {
    label: 'Investor',
    icon: '💰',
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Investment focused',
    defaultStage: 'qualification',
    commonTasks: [
      'Investment analysis',
      'ROI calculations',
      'Market research',
      'Property inspection',
      'Deal structuring'
    ]
  }
};

export const leadSources = {
  website: {
    label: 'Website',
    icon: '🌐',
    color: 'bg-blue-100 text-blue-800'
  },
  referral: {
    label: 'Referral',
    icon: '👥',
    color: 'bg-green-100 text-green-800'
  },
  social: {
    label: 'Social Media',
    icon: '📱',
    color: 'bg-purple-100 text-purple-800'
  },
  advertisement: {
    label: 'Advertisement',
    icon: '📢',
    color: 'bg-yellow-100 text-yellow-800'
  },
  'walk-in': {
    label: 'Walk-in',
    icon: '🚶',
    color: 'bg-gray-100 text-gray-800'
  },
  phone: {
    label: 'Phone Call',
    icon: '📞',
    color: 'bg-indigo-100 text-indigo-800'
  },
  event: {
    label: 'Event/Fair',
    icon: '🎪',
    color: 'bg-pink-100 text-pink-800'
  },
  partner: {
    label: 'Partner',
    icon: '🤝',
    color: 'bg-teal-100 text-teal-800'
  }
};

export const taskTypes = {
  call: {
    label: 'Phone Call',
    icon: '📞',
    color: 'bg-blue-100 text-blue-800',
    defaultDuration: 30 // minutes
  },
  meeting: {
    label: 'Meeting',
    icon: '🤝',
    color: 'bg-green-100 text-green-800',
    defaultDuration: 60
  },
  viewing: {
    label: 'Property Viewing',
    icon: '🏠',
    color: 'bg-purple-100 text-purple-800',
    defaultDuration: 45
  },
  document: {
    label: 'Document Task',
    icon: '📄',
    color: 'bg-orange-100 text-orange-800',
    defaultDuration: 15
  },
  follow_up: {
    label: 'Follow Up',
    icon: '🔄',
    color: 'bg-yellow-100 text-yellow-800',
    defaultDuration: 15
  },
  research: {
    label: 'Research',
    icon: '🔍',
    color: 'bg-indigo-100 text-indigo-800',
    defaultDuration: 30
  },
  reminder: {
    label: 'Reminder',
    icon: '⏰',
    color: 'bg-gray-100 text-gray-800',
    defaultDuration: 5
  }
};

export const priorityLevels = {
  low: {
    label: 'Low',
    color: 'border-l-green-500 bg-green-50',
    textColor: 'text-green-800',
    badgeColor: 'bg-green-100 text-green-800'
  },
  medium: {
    label: 'Medium',
    color: 'border-l-yellow-500 bg-yellow-50',
    textColor: 'text-yellow-800',
    badgeColor: 'bg-yellow-100 text-yellow-800'
  },
  high: {
    label: 'High',
    color: 'border-l-red-500 bg-red-50',
    textColor: 'text-red-800',
    badgeColor: 'bg-red-100 text-red-800'
  },
  urgent: {
    label: 'Urgent',
    color: 'border-l-red-600 bg-red-100',
    textColor: 'text-red-900',
    badgeColor: 'bg-red-200 text-red-900'
  }
};

// Helper functions
export const getClientTypeInfo = (type) => {
  return clientTypes[type] || clientTypes.buyer;
};

export const getLeadSourceInfo = (source) => {
  return leadSources[source] || leadSources.website;
};

export const getTaskTypeInfo = (type) => {
  return taskTypes[type] || taskTypes.reminder;
};

export const getPriorityInfo = (priority) => {
  return priorityLevels[priority] || priorityLevels.medium;
};

// Generate quick tasks for client type
export const generateQuickTasks = (clientName, clientType) => {
  const typeInfo = getClientTypeInfo(clientType);
  return typeInfo.commonTasks.map(task => ({
    title: `${task} - ${clientName}`,
    clientName,
    type: 'reminder',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  }));
};