// utils/stageConfig.js
export const stageConfig = {
  buyer: [
    { value: 'qualification', label: 'Qualification', color: 'bg-blue-100 text-blue-800', description: 'Understanding client needs' },
    { value: 'visits', label: 'Property Visits', color: 'bg-purple-100 text-purple-800', description: 'Viewing properties' },
    { value: 'negotiating', label: 'Negotiating', color: 'bg-yellow-100 text-yellow-800', description: 'Making offers' },
    { value: 'cpcv', label: 'CPCV Signed', color: 'bg-orange-100 text-orange-800', description: 'Promissory contract' },
    { value: 'deed', label: 'Deed Signing', color: 'bg-green-100 text-green-800', description: 'Final contract' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800', description: 'Transaction finished' }
  ],
  seller: [
    { value: 'qualification', label: 'Initial Contact', color: 'bg-blue-100 text-blue-800', description: 'First meeting with seller' },
    { value: 'visits', label: 'Property Evaluation', color: 'bg-purple-100 text-purple-800', description: 'Assessing the property' },
    { value: 'negotiating', label: 'Marketing', color: 'bg-yellow-100 text-yellow-800', description: 'Property on market' },
    { value: 'cpcv', label: 'CPCV Signed', color: 'bg-orange-100 text-orange-800', description: 'Buyer found' },
    { value: 'deed', label: 'Deed Signing', color: 'bg-green-100 text-green-800', description: 'Final sale' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800', description: 'Sale completed' }
  ],
  landlord: [
    { value: 'qualification', label: 'Property Assessment', color: 'bg-blue-100 text-blue-800', description: 'Evaluating rental property' },
    { value: 'visits', label: 'Marketing Property', color: 'bg-purple-100 text-purple-800', description: 'Finding tenants' },
    { value: 'negotiating', label: 'Tenant Selection', color: 'bg-yellow-100 text-yellow-800', description: 'Screening applicants' },
    { value: 'contract', label: 'Lease Signed', color: 'bg-orange-100 text-orange-800', description: 'Rental agreement' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800', description: 'Tenant moved in' }
  ],
  tenant: [
    { value: 'qualification', label: 'Requirements', color: 'bg-blue-100 text-blue-800', description: 'Understanding tenant needs' },
    { value: 'visits', label: 'Property Viewings', color: 'bg-purple-100 text-purple-800', description: 'Showing properties' },
    { value: 'negotiating', label: 'Application', color: 'bg-yellow-100 text-yellow-800', description: 'Processing application' },
    { value: 'contract', label: 'Lease Signed', color: 'bg-orange-100 text-orange-800', description: 'Rental agreement' },
    { value: 'completed', label: 'Moved In', color: 'bg-gray-100 text-gray-800', description: 'Successfully moved in' }
  ]
};

export const getStageColor = (stage) => {
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

export const getNextStage = (currentStage, clientType) => {
  const stages = stageConfig[clientType];
  if (!stages) return null;
  
  const currentIndex = stages.findIndex(stage => stage.value === currentStage);
  if (currentIndex === -1 || currentIndex === stages.length - 1) return null;
  
  return stages[currentIndex + 1];
};

export const getPreviousStage = (currentStage, clientType) => {
  const stages = stageConfig[clientType];
  if (!stages) return null;
  
  const currentIndex = stages.findIndex(stage => stage.value === currentStage);
  if (currentIndex <= 0) return null;
  
  return stages[currentIndex - 1];
};

export const getStageProgress = (currentStage, clientType) => {
  const stages = stageConfig[clientType];
  if (!stages) return 0;
  
  const currentIndex = stages.findIndex(stage => stage.value === currentStage);
  if (currentIndex === -1) return 0;
  
  return ((currentIndex + 1) / stages.length) * 100;
};