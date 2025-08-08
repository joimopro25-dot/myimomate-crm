// utils/sampleData.js
// Sample data for development and testing

export const sampleLeads = [
  {
    id: 'lead1',
    name: 'Maria Silva',
    phone: '+351 912 345 678',
    email: 'maria.silva@email.com',
    type: 'buyer',
    source: 'website',
    status: 'new',
    notes: 'Looking for T2 apartment in Porto center, budget up to €200k',
    createdAt: new Date('2025-01-05')
  },
  {
    id: 'lead2',
    name: 'João Santos',
    phone: '+351 913 456 789',
    email: 'joao.santos@email.com',
    type: 'seller',
    source: 'referral',
    status: 'contacted',
    notes: 'Wants to sell inherited property in Matosinhos',
    createdAt: new Date('2025-01-04')
  },
  {
    id: 'lead3',
    name: 'Ana Costa',
    phone: '+351 914 567 890',
    email: 'ana.costa@email.com',
    type: 'tenant',
    source: 'social',
    status: 'qualified',
    notes: 'Young professional, needs studio or T1 near metro',
    createdAt: new Date('2025-01-03')
  }
];

export const sampleClients = [
  {
    id: 'client1',
    name: 'Laura Mendes',
    phone: '+351 915 678 901',
    email: 'laura.mendes@email.com',
    type: 'buyer',
    stage: 'visits',
    source: 'referral',
    lastContact: new Date('2025-01-05'),
    notes: 'First-time buyer, pre-approved for €180k mortgage. Interested in modern apartments.',
    createdAt: new Date('2024-12-15')
  },
  {
    id: 'client2',
    name: 'Carlos Oliveira',
    phone: '+351 916 789 012',
    email: 'carlos.oliveira@email.com',
    type: 'seller',
    stage: 'negotiating',
    source: 'website',
    lastContact: new Date('2025-01-03'),
    notes: 'T2 apartment in Vila do Conde, good condition. Asking €150k.',
    createdAt: new Date('2024-12-10')
  },
  {
    id: 'client3',
    name: 'Patricia Rodrigues',
    phone: '+351 917 890 123',
    email: 'patricia.rodrigues@email.com',
    type: 'landlord',
    stage: 'qualification',
    source: 'advertisement',
    lastContact: new Date('2025-01-02'),
    notes: 'Has multiple properties to rent. Looking for long-term tenants.',
    createdAt: new Date('2024-12-20')
  },
  {
    id: 'client4',
    name: 'Miguel Torres',
    phone: '+351 918 901 234',
    email: 'miguel.torres@email.com',
    type: 'investor',
    stage: 'cpcv',
    source: 'referral',
    lastContact: new Date('2025-01-04'),
    notes: 'Experienced investor, looking for properties with good ROI potential.',
    createdAt: new Date('2024-11-30')
  }
];

export const sampleTasks = [
  {
    id: 'task1',
    title: 'Call Laura for property viewing feedback',
    clientName: 'Laura Mendes',
    type: 'call',
    priority: 'high',
    dueDate: new Date('2025-01-06'),
    completed: false,
    notes: 'Follow up on yesterday\'s property viewing',
    createdAt: new Date('2025-01-05')
  },
  {
    id: 'task2',
    title: 'Prepare market analysis for Carlos',
    clientName: 'Carlos Oliveira',
    type: 'document',
    priority: 'medium',
    dueDate: new Date('2025-01-07'),
    completed: false,
    notes: 'Comparative market analysis for pricing strategy',
    createdAt: new Date('2025-01-04')
  },
  {
    id: 'task3',
    title: 'Schedule property evaluation with Patricia',
    clientName: 'Patricia Rodrigues',
    type: 'meeting',
    priority: 'medium',
    dueDate: new Date('2025-01-08'),
    completed: false,
    notes: 'Visit all three properties for rental assessment',
    createdAt: new Date('2025-01-03')
  },
  {
    id: 'task4',
    title: 'Send CPCV documents to Miguel',
    clientName: 'Miguel Torres',
    type: 'document',
    priority: 'high',
    dueDate: new Date('2025-01-06'),
    completed: false,
    notes: 'Final review before signing',
    createdAt: new Date('2025-01-05')
  },
  {
    id: 'task5',
    title: 'Research new listings for Laura',
    clientName: 'Laura Mendes',
    type: 'research',
    priority: 'low',
    dueDate: new Date('2025-01-09'),
    completed: true,
    completedAt: new Date('2025-01-05'),
    notes: 'Found 3 potential properties matching criteria',
    createdAt: new Date('2025-01-02')
  }
];

// Statistics for dashboard
export const sampleStats = {
  totalClients: sampleClients.length,
  totalLeads: sampleLeads.length,
  pendingTasks: sampleTasks.filter(task => !task.completed).length,
  dueTodayTasks: sampleTasks.filter(task => 
    !task.completed && 
    task.dueDate.toDateString() === new Date().toDateString()
  ).length,
  clientsByType: {
    buyer: sampleClients.filter(c => c.type === 'buyer').length,
    seller: sampleClients.filter(c => c.type === 'seller').length,
    landlord: sampleClients.filter(c => c.type === 'landlord').length,
    tenant: sampleClients.filter(c => c.type === 'tenant').length,
    investor: sampleClients.filter(c => c.type === 'investor').length
  },
  leadsBySource: {
    website: sampleLeads.filter(l => l.source === 'website').length,
    referral: sampleLeads.filter(l => l.source === 'referral').length,
    social: sampleLeads.filter(l => l.source === 'social').length,
    advertisement: sampleLeads.filter(l => l.source === 'advertisement').length
  }
};

// Helper function to get random sample data
export const getRandomClient = () => {
  const types = ['buyer', 'seller', 'landlord', 'tenant'];
  const sources = ['website', 'referral', 'social', 'advertisement'];
  const names = [
    'António Silva', 'Maria Santos', 'José Ferreira', 'Ana Rodrigues',
    'Carlos Pereira', 'Isabel Costa', 'Manuel Oliveira', 'Teresa Martins',
    'Pedro Sousa', 'Cristina Alves', 'João Gonçalves', 'Fernanda Lima'
  ];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  
  return {
    name: randomName,
    phone: `+351 91${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    email: `${randomName.toLowerCase().replace(' ', '.')}@email.com`,
    type: randomType,
    source: randomSource,
    stage: 'qualification',
    lastContact: new Date(),
    notes: `Sample client created for testing - ${randomType}`,
    createdAt: new Date()
  };
};

export const getRandomLead = () => {
  const types = ['buyer', 'seller', 'landlord', 'tenant'];
  const sources = ['website', 'referral', 'social', 'advertisement', 'walk-in', 'phone'];
  const names = [
    'Ricardo Moura', 'Sofia Dias', 'Bruno Carvalho', 'Patrícia Nunes',
    'André Fonseca', 'Catarina Vieira', 'Rui Barbosa', 'Mónica Teixeira',
    'Nuno Correia', 'Susana Marques', 'Luís Ribeiro', 'Helena Pinto'
  ];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  
  return {
    name: randomName,
    phone: `+351 92${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    email: `${randomName.toLowerCase().replace(' ', '.')}@email.com`,
    type: randomType,
    source: randomSource,
    status: 'new',
    notes: `Sample lead created for testing - ${randomType}`,
    createdAt: new Date()
  };
};

export const getRandomTask = (clientName = 'General') => {
  const types = ['call', 'meeting', 'viewing', 'document', 'follow_up', 'research', 'reminder'];
  const priorities = ['low', 'medium', 'high'];
  const tasks = [
    'Follow up call',
    'Property viewing',
    'Document preparation',
    'Market research',
    'Client meeting',
    'Contract review',
    'Property evaluation'
  ];
  
  const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
  
  return {
    title: `${randomTask} - ${clientName}`,
    clientName,
    type: randomType,
    priority: randomPriority,
    dueDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000), // Random date within a week
    completed: false,
    notes: `Sample task created for testing`,
    createdAt: new Date()
  };
};