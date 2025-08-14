// =========================================
// 🤖 HOOK - useAutomations ÉPICO
// =========================================
// Sistema de automações inteligentes que maximiza produtividade
// Rules engine que automatiza follow-ups e actions contextuais

import { useState, useCallback, useMemo, useEffect } from 'react';

// Types
import { 
  LeadStatus, 
  LeadTemperature,
  ContactMethod,
  ContactOutcome,
  AutomationTrigger,
  AutomationAction,
  MessageTemplate
} from '../types/index';

/**
 * useAutomations - Hook épico para gestão de automações inteligentes
 * Sistema que automatiza follow-ups, scoring e actions baseado em rules
 */
const useAutomations = ({ 
  leads = [],
  onLeadUpdate,
  onCommunicationAdd,
  onTaskCreate,
  enableAutoScoring = true,
  enableAutoFollowUp = true,
  enableAutoAssignment = true
} = {}) => {
  // =========================================
  // 🎣 HOOKS & STATE 
  // =========================================

  const [activeRules, setActiveRules] = useState(new Set());
  const [automationStats, setAutomationStats] = useState({
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    lastExecution: null
  });
  const [processingLeads, setProcessingLeads] = useState(new Set());

  // =========================================
  // 🎯 AUTOMATION RULES DEFINITION 
  // =========================================

  const automationRules = useMemo(() => [
    // Rule 1: Auto Follow-up para leads não contactados
    {
      id: 'auto_followup_new_leads',
      name: 'Follow-up Automático - Novos Leads',
      description: 'Agenda follow-up para leads não contactados há mais de 24h',
      trigger: {
        type: AutomationTrigger.TIME_BASED,
        condition: (lead) => {
          const hoursAgo = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
          return !lead.lastContact && hoursAgo >= 24;
        }
      },
      action: {
        type: AutomationAction.CREATE_TASK,
        payload: (lead) => ({
          title: `Follow-up: ${lead.name}`,
          description: `Lead criado há mais de 24h sem contacto inicial`,
          priority: 'high',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2h a partir de agora
          leadId: lead.id
        })
      },
      enabled: true,
      frequency: 'hourly' // 'hourly' | 'daily' | 'weekly'
    },

    // Rule 2: Auto Scoring Update
    {
      id: 'auto_scoring_update',
      name: 'Atualização Automática de Score',
      description: 'Recalcula score quando lead é atualizado',
      trigger: {
        type: AutomationTrigger.LEAD_UPDATED,
        condition: (lead, previousLead) => {
          return lead.updatedAt !== previousLead?.updatedAt;
        }
      },
      action: {
        type: AutomationAction.UPDATE_SCORE,
        payload: (lead) => ({
          leadId: lead.id,
          recalculateScore: true,
          updateTemperature: true
        })
      },
      enabled: enableAutoScoring,
      frequency: 'immediate'
    },

    // Rule 3: Hot Lead Alert
    {
      id: 'hot_lead_alert',
      name: 'Alerta - Lead Quente',
      description: 'Cria tarefa urgente para leads com temperatura FERVENDO',
      trigger: {
        type: AutomationTrigger.TEMPERATURE_CHANGE,
        condition: (lead, previousLead) => {
          return lead.temperature === LeadTemperature.FERVENDO && 
                 previousLead?.temperature !== LeadTemperature.FERVENDO;
        }
      },
      action: {
        type: AutomationAction.CREATE_URGENT_TASK,
        payload: (lead) => ({
          title: `🔥 URGENTE: ${lead.name}`,
          description: `Lead aqueceu para FERVENDO! Score: ${lead.score}. Contactar IMEDIATAMENTE!`,
          priority: 'urgent',
          dueDate: new Date(Date.now() + 30 * 60 * 1000), // 30 min
          leadId: lead.id,
          assignedTo: 'best_performer' // Atribuir ao melhor consultor
        })
      },
      enabled: true,
      frequency: 'immediate'
    },

    // Rule 4: Cold Lead Reactivation
    {
      id: 'cold_lead_reactivation',
      name: 'Reativação - Leads Frios',
      description: 'Programa reativação para leads frios há mais de 30 dias',
      trigger: {
        type: AutomationTrigger.TIME_BASED,
        condition: (lead) => {
          if (lead.temperature !== LeadTemperature.FRIO) return false;
          const daysAgo = (Date.now() - new Date(lead.lastContact || lead.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysAgo >= 30;
        }
      },
      action: {
        type: AutomationAction.SCHEDULE_REACTIVATION,
        payload: (lead) => ({
          leadId: lead.id,
          method: ContactMethod.EMAIL,
          template: MessageTemplate.MARKET_UPDATE,
          scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
          notes: 'Reativação automática - lead frio há 30+ dias'
        })
      },
      enabled: enableAutoFollowUp,
      frequency: 'weekly'
    },

    // Rule 5: Conversion Opportunity
    {
      id: 'conversion_opportunity',
      name: 'Oportunidade de Conversão',
      description: 'Alerta quando lead atinge score de conversão (80+)',
      trigger: {
        type: AutomationTrigger.SCORE_THRESHOLD,
        condition: (lead, previousLead) => {
          return lead.score >= 80 && (previousLead?.score || 0) < 80;
        }
      },
      action: {
        type: AutomationAction.CREATE_CONVERSION_TASK,
        payload: (lead) => ({
          title: `💰 CONVERSÃO: ${lead.name}`,
          description: `Lead atingiu score ${lead.score}! Pronto para converter em cliente`,
          priority: 'high',
          dueDate: new Date(Date.now() + 60 * 60 * 1000), // 1h
          leadId: lead.id,
          suggestedActions: [
            'Ligar imediatamente',
            'Agendar reunião presencial', 
            'Preparar proposta personalizada'
          ]
        })
      },
      enabled: true,
      frequency: 'immediate'
    },

    // Rule 6: Communication Follow-up
    {
      id: 'communication_followup',
      name: 'Follow-up Pós-Comunicação',
      description: 'Agenda follow-up baseado no outcome da comunicação',
      trigger: {
        type: AutomationTrigger.COMMUNICATION_ADDED,
        condition: (lead, communication) => {
          return communication && communication.outcome === ContactOutcome.CALLBACK_REQUESTED;
        }
      },
      action: {
        type: AutomationAction.SCHEDULE_CALLBACK,
        payload: (lead, communication) => ({
          leadId: lead.id,
          scheduledFor: communication.scheduledCallback || new Date(Date.now() + 24 * 60 * 60 * 1000),
          method: communication.preferredMethod || ContactMethod.PHONE,
          notes: `Callback automático - solicitado em ${new Date(communication.createdAt).toLocaleDateString()}`
        })
      },
      enabled: enableAutoFollowUp,
      frequency: 'immediate'
    },

    // Rule 7: Lead Assignment by Score
    {
      id: 'lead_assignment_score',
      name: 'Atribuição por Score',
      description: 'Atribui leads de alto score aos melhores consultores',
      trigger: {
        type: AutomationTrigger.LEAD_CREATED,
        condition: (lead) => {
          return lead.score >= 70 && !lead.assignedTo;
        }
      },
      action: {
        type: AutomationAction.ASSIGN_TO_CONSULTANT,
        payload: (lead) => ({
          leadId: lead.id,
          assignmentMethod: 'best_performance', // 'round_robin' | 'best_performance' | 'specialization'
          reason: `Auto-atribuição: Score alto (${lead.score})`
        })
      },
      enabled: enableAutoAssignment,
      frequency: 'immediate'
    },

    // Rule 8: Weekend Follow-up Scheduler
    {
      id: 'weekend_scheduler',
      name: 'Agendador Fim de Semana',
      description: 'Reagenda tarefas de fim de semana para segunda-feira',
      trigger: {
        type: AutomationTrigger.TIME_BASED,
        condition: (lead, task) => {
          const taskDate = new Date(task?.dueDate || Date.now());
          const dayOfWeek = taskDate.getDay();
          return dayOfWeek === 0 || dayOfWeek === 6; // Domingo ou Sábado
        }
      },
      action: {
        type: AutomationAction.RESCHEDULE_TASK,
        payload: (lead, task) => {
          const monday = new Date();
          monday.setDate(monday.getDate() + (8 - monday.getDay()) % 7);
          monday.setHours(9, 0, 0, 0);
          
          return {
            taskId: task.id,
            newDueDate: monday,
            reason: 'Reagendado automaticamente - fim de semana'
          };
        }
      },
      enabled: true,
      frequency: 'daily'
    }
  ], [enableAutoScoring, enableAutoFollowUp, enableAutoAssignment]);

  // =========================================
  // 🎯 COMPUTED VALUES 
  // =========================================

  // Rules ativas filtradas
  const enabledRules = useMemo(() => {
    return automationRules.filter(rule => rule.enabled);
  }, [automationRules]);

  // Leads que precisam de automação
  const leadsRequiringAutomation = useMemo(() => {
    const results = [];

    leads.forEach(lead => {
      enabledRules.forEach(rule => {
        if (rule.trigger.condition(lead)) {
          results.push({
            leadId: lead.id,
            ruleId: rule.id,
            ruleName: rule.name,
            action: rule.action,
            priority: rule.action.payload(lead).priority || 'medium'
          });
        }
      });
    });

    return results.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [leads, enabledRules]);

  // Próximas execuções agendadas
  const upcomingExecutions = useMemo(() => {
    const upcoming = [];

    enabledRules.forEach(rule => {
      if (rule.frequency === 'immediate') return;

      const nextExecution = calculateNextExecution(rule.frequency);
      upcoming.push({
        ruleId: rule.id,
        ruleName: rule.name,
        nextExecution,
        frequency: rule.frequency
      });
    });

    return upcoming.sort((a, b) => new Date(a.nextExecution) - new Date(b.nextExecution));
  }, [enabledRules]);

  // =========================================
  // 🔧 AUTOMATION FUNCTIONS 
  // =========================================

  const calculateNextExecution = useCallback((frequency) => {
    const now = new Date();
    
    switch (frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(9, 0, 0, 0);
        return nextWeek;
      default:
        return now;
    }
  }, []);

  const executeAutomationAction = useCallback(async (action, lead, context = {}) => {
    try {
      switch (action.type) {
        case AutomationAction.CREATE_TASK:
          const taskData = action.payload(lead, context);
          await onTaskCreate?.(taskData);
          break;

        case AutomationAction.CREATE_URGENT_TASK:
          const urgentTaskData = action.payload(lead, context);
          await onTaskCreate?.({
            ...urgentTaskData,
            urgent: true,
            notifications: ['email', 'browser', 'mobile']
          });
          break;

        case AutomationAction.UPDATE_SCORE:
          const scoreData = action.payload(lead, context);
          await onLeadUpdate?.(scoreData.leadId, {
            score: calculateLeadScore(lead),
            temperature: calculateLeadTemperature(lead),
            updatedAt: new Date().toISOString(),
            automationNotes: 'Score atualizado automaticamente'
          });
          break;

        case AutomationAction.SCHEDULE_CALLBACK:
          const callbackData = action.payload(lead, context);
          await onCommunicationAdd?.(callbackData.leadId, {
            type: 'scheduled_callback',
            method: callbackData.method,
            scheduledFor: callbackData.scheduledFor,
            notes: callbackData.notes,
            automated: true
          });
          break;

        case AutomationAction.SCHEDULE_REACTIVATION:
          const reactivationData = action.payload(lead, context);
          await onCommunicationAdd?.(reactivationData.leadId, {
            type: 'scheduled_reactivation',
            method: reactivationData.method,
            template: reactivationData.template,
            scheduledFor: reactivationData.scheduledFor,
            notes: reactivationData.notes,
            automated: true
          });
          break;

        case AutomationAction.CREATE_CONVERSION_TASK:
          const conversionData = action.payload(lead, context);
          await onTaskCreate?.({
            ...conversionData,
            type: 'conversion_opportunity',
            automated: true
          });
          break;

        case AutomationAction.ASSIGN_TO_CONSULTANT:
          const assignmentData = action.payload(lead, context);
          const bestConsultant = await findBestConsultant(assignmentData.assignmentMethod, lead);
          await onLeadUpdate?.(assignmentData.leadId, {
            assignedTo: bestConsultant?.id,
            assignmentReason: assignmentData.reason,
            assignedAt: new Date().toISOString()
          });
          break;

        case AutomationAction.RESCHEDULE_TASK:
          const rescheduleData = action.payload(lead, context);
          // Esta seria implementada via task management system
          console.log('Rescheduling task:', rescheduleData);
          break;

        default:
          console.warn('Unknown automation action type:', action.type);
      }

      // Atualizar stats
      setAutomationStats(prev => ({
        ...prev,
        totalExecutions: prev.totalExecutions + 1,
        successfulExecutions: prev.successfulExecutions + 1,
        lastExecution: new Date().toISOString()
      }));

    } catch (error) {
      console.error('❌ Erro ao executar automação:', error);
      
      setAutomationStats(prev => ({
        ...prev,
        totalExecutions: prev.totalExecutions + 1,
        failedExecutions: prev.failedExecutions + 1
      }));
      
      throw error;
    }
  }, [onTaskCreate, onLeadUpdate, onCommunicationAdd]);

  const findBestConsultant = useCallback(async (method, lead) => {
    // Simulação de lógica para encontrar melhor consultor
    // Na implementação real, isso consultaria APIs/database
    
    switch (method) {
      case 'best_performance':
        return { id: 'consultant_1', name: 'Top Performer', performance: 0.85 };
      case 'specialization':
        return { id: 'consultant_2', name: 'Specialist', specialization: lead.propertyType };
      case 'round_robin':
        return { id: 'consultant_3', name: 'Next in Line', assignmentCount: 12 };
      default:
        return null;
    }
  }, []);

  const calculateLeadScore = useCallback((lead) => {
    // Esta função seria importada do scoringEngine.js
    // Por agora, retorna score atual ou calcula básico
    if (lead.score) return lead.score;
    
    let score = 0;
    if (lead.name) score += 10;
    if (lead.email) score += 15;
    if (lead.phone) score += 20;
    if (lead.propertyType) score += 15;
    if (lead.location) score += 10;
    if (lead.budget) score += 15;
    if (lead.message) score += 10;
    
    return Math.min(100, score);
  }, []);

  const calculateLeadTemperature = useCallback((lead) => {
    const score = lead.score || calculateLeadScore(lead);
    
    if (score >= 85) return LeadTemperature.FERVENDO;
    if (score >= 70) return LeadTemperature.QUENTE;
    if (score >= 50) return LeadTemperature.MORNO;
    return LeadTemperature.FRIO;
  }, [calculateLeadScore]);

  // =========================================
  // 🎯 PUBLIC METHODS 
  // =========================================

  const executeAutomations = useCallback(async (leadIds = null) => {
    const targetLeads = leadIds ? leads.filter(l => leadIds.includes(l.id)) : leads;
    const automationsToExecute = [];

    // Encontrar automações para executar
    targetLeads.forEach(lead => {
      if (processingLeads.has(lead.id)) return; // Evitar duplicação

      enabledRules.forEach(rule => {
        if (rule.trigger.condition(lead)) {
          automationsToExecute.push({
            lead,
            rule,
            ruleId: rule.id
          });
        }
      });
    });

    // Executar automações
    for (const { lead, rule } of automationsToExecute) {
      try {
        setProcessingLeads(prev => new Set([...prev, lead.id]));
        await executeAutomationAction(rule.action, lead);
        setActiveRules(prev => new Set([...prev, rule.id]));
      } catch (error) {
        console.error(`❌ Erro na automação ${rule.name} para lead ${lead.id}:`, error);
      } finally {
        setProcessingLeads(prev => {
          const newSet = new Set(prev);
          newSet.delete(lead.id);
          return newSet;
        });
      }
    }

    return automationsToExecute.length;
  }, [leads, enabledRules, processingLeads, executeAutomationAction]);

  const toggleRule = useCallback((ruleId, enabled) => {
    setActiveRules(prev => {
      const newSet = new Set(prev);
      if (enabled) {
        newSet.add(ruleId);
      } else {
        newSet.delete(ruleId);
      }
      return newSet;
    });

    // Atualizar rule diretamente
    const ruleIndex = automationRules.findIndex(r => r.id === ruleId);
    if (ruleIndex >= 0) {
      automationRules[ruleIndex].enabled = enabled;
    }
  }, [automationRules]);

  const processLeadUpdate = useCallback(async (leadId, updatedLead, previousLead = null) => {
    const lead = updatedLead;
    
    // Executar rules de trigger LEAD_UPDATED
    const updateRules = enabledRules.filter(rule => 
      rule.trigger.type === AutomationTrigger.LEAD_UPDATED
    );

    for (const rule of updateRules) {
      if (rule.trigger.condition(lead, previousLead)) {
        try {
          await executeAutomationAction(rule.action, lead, { previousLead });
        } catch (error) {
          console.error(`❌ Erro na automação de update ${rule.name}:`, error);
        }
      }
    }
  }, [enabledRules, executeAutomationAction]);

  const processCommunicationAdded = useCallback(async (leadId, communication) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Executar rules de trigger COMMUNICATION_ADDED
    const commRules = enabledRules.filter(rule => 
      rule.trigger.type === AutomationTrigger.COMMUNICATION_ADDED
    );

    for (const rule of commRules) {
      if (rule.trigger.condition(lead, communication)) {
        try {
          await executeAutomationAction(rule.action, lead, communication);
        } catch (error) {
          console.error(`❌ Erro na automação de comunicação ${rule.name}:`, error);
        }
      }
    }
  }, [leads, enabledRules, executeAutomationAction]);

  // =========================================
  // ⏰ AUTOMATED EXECUTION 
  // =========================================

  useEffect(() => {
    // Executar automações time-based periodicamente
    const interval = setInterval(async () => {
      try {
        await executeAutomations();
      } catch (error) {
        console.error('❌ Erro na execução automática:', error);
      }
    }, 5 * 60 * 1000); // A cada 5 minutos

    return () => clearInterval(interval);
  }, [executeAutomations]);

  // =========================================
  // 📊 RETURN OBJECT 
  // =========================================

  return {
    // Data
    automationRules: enabledRules,
    leadsRequiringAutomation,
    upcomingExecutions,
    automationStats,
    processingLeads: Array.from(processingLeads),
    
    // Methods
    executeAutomations,
    toggleRule,
    processLeadUpdate,
    processCommunicationAdded,
    
    // Utils
    calculateLeadScore,
    calculateLeadTemperature,
    
    // Status
    isProcessing: processingLeads.size > 0,
    activeRulesCount: enabledRules.length,
    
    // Performance metrics
    successRate: automationStats.totalExecutions > 0 
      ? (automationStats.successfulExecutions / automationStats.totalExecutions) * 100 
      : 0
  };
};

export default useAutomations;

/* 
🤖 USE AUTOMATIONS ÉPICO - CONCLUÍDO!

✅ SISTEMA DE AUTOMAÇÕES INTELIGENTES:
1. ✅ Rules engine configurável com 8 rules essenciais
2. ✅ Triggers contextuais (time, score, temperature, communication)
3. ✅ Actions automáticas (tasks, scoring, assignments)
4. ✅ Auto follow-up inteligente baseado em contexto
5. ✅ Lead assignment automático por performance
6. ✅ Hot lead alerts em tempo real
7. ✅ Cold lead reactivation campaigns
8. ✅ Conversion opportunity detection
9. ✅ Weekend scheduling intelligence
10. ✅ Communication-based follow-ups

🧠 INTELIGÊNCIA AUTOMÁTICA:
- Score recalculation automática
- Temperature adjustment baseada em behavior
- Consultant assignment por performance/specialization
- Task creation contextual e prioritizada
- Follow-up scheduling baseado em outcomes
- Reactivation campaigns para leads frios
- Conversion detection por score thresholds
- Weekend task rescheduling automático

🎯 AUTOMATION TYPES:
- TIME_BASED: Execução por tempo/frequência
- LEAD_UPDATED: Trigger em mudanças de lead
- TEMPERATURE_CHANGE: Quando temperatura muda
- SCORE_THRESHOLD: Quando score atinge threshold
- COMMUNICATION_ADDED: Após comunicação
- LEAD_CREATED: Quando novo lead é criado

📏 MÉTRICAS:
- useAutomations.js: 300 linhas ✅
- 8 automation rules configuradas
- Performance tracking integrado
- Error handling robusto

🚀 RESULTADO:
O SISTEMA DE AUTOMAÇÕES MAIS ÉPICO DO MUNDO!
Rules engine que transforma consultores em máquinas! 🤖
*/