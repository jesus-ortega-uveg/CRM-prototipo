import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  User,
  Kanban,
  List,
  Star,
  Clock,
  Settings,
  ChevronDown,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  ArrowRight,
  Target,
  DollarSign,
  Tag,
  FileText,
  Download,
  X,
  Save,
  Zap,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  Briefcase,
  Users,
  GripVertical,
  Bot,
  Code,
  Palette,
  Move,
  Copy,
  Archive,
  UserCheck,
  PhoneCall,
  Calendar as CalendarIcon,
  Hash,
  Sparkles,
  Wand2,
  Brain,
  MessageCircle,
  Activity,
  BarChart3,
  Headphones,
  ShoppingCart,
  Layers,
  GitBranch,
  Workflow
} from 'lucide-react';
import type { UserRole } from '../App';

interface LeadsProps {
  userRole: UserRole;
}

type ViewType = 'kanban' | 'table';

interface Pipeline {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  phases: Phase[];
}

interface Phase {
  id: string;
  name: string;
  color: string;
  order: number;
  automations: Automation[];
  aiPrompt?: string;
  systemVariables: string[];
}

interface Automation {
  id: string;
  type: 'task' | 'assignment' | 'notification' | 'ai_message' | 'move_phase' | 'tag_add';
  action: string;
  conditions?: string[];
  prompt?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  phaseId: string;
  priority: 'alta' | 'media' | 'baja';
  source: string;
  value: number;
  lastContact: string;
  assignedTo: string;
  tags: string[];
  tasks: Task[];
  notes: string;
  avatar?: string;
  status: 'active' | 'won' | 'lost';
  createdAt: string;
  lastActivity: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

const Leads: React.FC<LeadsProps> = ({ userRole }) => {
  const [viewType, setViewType] = useState<ViewType>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPipeline, setSelectedPipeline] = useState('sales');
  const [showPipelineEditor, setShowPipelineEditor] = useState(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showLeadDetail, setShowLeadDetail] = useState<string | null>(null);
  const [showEditLead, setShowEditLead] = useState<string | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverPhase, setDragOverPhase] = useState<string | null>(null);
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [showAutomationModal, setShowAutomationModal] = useState<{leadId: string, fromPhase: string, toPhase: string} | null>(null);
  const [showAddPhaseModal, setShowAddPhaseModal] = useState(false);
  const [newPhase, setNewPhase] = useState({
    name: '',
    color: 'blue',
    automationPrompt: '',
    automationType: 'message' as 'message' | 'task' | 'assignment'
  });

  const dragRef = useRef<HTMLDivElement>(null);

  const mockPipelines: Pipeline[] = [
    {
      id: 'sales',
      name: 'Pipeline de Ventas B2B',
      description: 'Proceso estándar de ventas empresariales',
      icon: TrendingUp,
      color: 'blue',
      phases: [
        { 
          id: 'lead', 
          name: 'Lead Inicial', 
          color: 'blue', 
          order: 1, 
          automations: [
            {
              id: '1',
              type: 'ai_message',
              action: 'Enviar mensaje de bienvenida',
              prompt: 'Hola {nombre}, gracias por tu interés en nuestros servicios. Soy {agente} y estaré encantado de ayudarte. ¿Podrías contarme más sobre tu empresa {empresa} y qué tipo de solución estás buscando?',
              conditions: ['nuevo_lead']
            }
          ],
          aiPrompt: 'Analiza si el lead ha mostrado interés real y tiene presupuesto. Variables: {nombre}, {empresa}, {presupuesto}, {necesidad}',
          systemVariables: ['{nombre}', '{empresa}', '{telefono}', '{email}', '{agente}', '{fecha}', '{presupuesto}', '{necesidad}']
        },
        { 
          id: 'qualified', 
          name: 'Calificado', 
          color: 'yellow', 
          order: 2, 
          automations: [
            {
              id: '2',
              type: 'task',
              action: 'Crear tarea de seguimiento',
              prompt: 'Programar llamada de descubrimiento con {nombre} de {empresa} para validar necesidades y presupuesto'
            }
          ],
          aiPrompt: 'Evalúa si el lead tiene autoridad de decisión y presupuesto confirmado. Variables: {autoridad}, {presupuesto_confirmado}, {timeline}',
          systemVariables: ['{nombre}', '{empresa}', '{autoridad}', '{presupuesto_confirmado}', '{timeline}', '{decision_makers}']
        },
        { 
          id: 'proposal', 
          name: 'Propuesta Enviada', 
          color: 'purple', 
          order: 3, 
          automations: [
            {
              id: '3',
              type: 'ai_message',
              action: 'Seguimiento de propuesta',
              prompt: 'Hola {nombre}, espero que hayas tenido oportunidad de revisar nuestra propuesta para {empresa}. ¿Tienes alguna pregunta o necesitas aclarar algún punto? Estoy disponible para una llamada cuando te convenga.',
              conditions: ['propuesta_enviada', 'sin_respuesta_48h']
            }
          ],
          aiPrompt: 'Determina si la propuesta fue bien recibida y si hay objeciones. Variables: {feedback_propuesta}, {objeciones}, {timeline_decision}',
          systemVariables: ['{nombre}', '{empresa}', '{propuesta_valor}', '{feedback_propuesta}', '{objeciones}', '{timeline_decision}']
        },
        { 
          id: 'negotiation', 
          name: 'Negociación', 
          color: 'orange', 
          order: 4, 
          automations: [
            {
              id: '4',
              type: 'assignment',
              action: 'Asignar a gerente comercial',
              conditions: ['valor_alto']
            }
          ],
          aiPrompt: 'Analiza las objeciones y determina estrategia de cierre. Variables: {objeciones}, {precio_objetivo}, {competencia}',
          systemVariables: ['{nombre}', '{empresa}', '{objeciones}', '{precio_objetivo}', '{competencia}', '{urgencia}']
        },
        { 
          id: 'closed_won', 
          name: 'Cerrado Ganado', 
          color: 'green', 
          order: 5, 
          automations: [
            {
              id: '5',
              type: 'ai_message',
              action: 'Mensaje de bienvenida cliente',
              prompt: '¡Felicidades {nombre}! Bienvenido a la familia de {empresa_nuestra}. Tu gerente de cuenta {account_manager} se pondrá en contacto contigo en las próximas 24 horas para iniciar el proceso de onboarding.'
            }
          ],
          aiPrompt: 'Lead convertido exitosamente. Iniciar proceso de onboarding.',
          systemVariables: ['{nombre}', '{empresa}', '{valor_final}', '{account_manager}', '{fecha_cierre}']
        },
        { 
          id: 'closed_lost', 
          name: 'Cerrado Perdido', 
          color: 'red', 
          order: 6, 
          automations: [
            {
              id: '6',
              type: 'tag_add',
              action: 'Agregar etiqueta de razón de pérdida',
              conditions: ['motivo_perdida']
            }
          ],
          aiPrompt: 'Analizar razón de pérdida para mejorar proceso. Variables: {motivo_perdida}, {competencia_ganadora}',
          systemVariables: ['{nombre}', '{empresa}', '{motivo_perdida}', '{competencia_ganadora}', '{feedback}']
        }
      ]
    },
    {
      id: 'support',
      name: 'Pipeline de Soporte Técnico',
      description: 'Gestión de tickets y soporte al cliente',
      icon: Headphones,
      color: 'green',
      phases: [
        { 
          id: 'new_ticket', 
          name: 'Ticket Nuevo', 
          color: 'red', 
          order: 1, 
          automations: [
            {
              id: '7',
              type: 'ai_message',
              action: 'Confirmación de ticket',
              prompt: 'Hola {nombre}, hemos recibido tu solicitud de soporte #{ticket_id}. Nuestro equipo técnico la revisará y te responderemos en un máximo de {sla_tiempo}. Gracias por tu paciencia.'
            }
          ],
          aiPrompt: 'Clasificar urgencia y tipo de problema. Variables: {problema}, {urgencia}, {cliente_tipo}',
          systemVariables: ['{nombre}', '{ticket_id}', '{problema}', '{urgencia}', '{cliente_tipo}', '{sla_tiempo}']
        },
        { 
          id: 'assigned', 
          name: 'Asignado', 
          color: 'yellow', 
          order: 2, 
          automations: [
            {
              id: '8',
              type: 'assignment',
              action: 'Asignar técnico especializado',
              conditions: ['tipo_problema']
            }
          ],
          aiPrompt: 'Asignar al técnico más adecuado según especialización. Variables: {tipo_problema}, {tecnico_disponible}',
          systemVariables: ['{nombre}', '{tipo_problema}', '{tecnico_asignado}', '{especialidad}']
        },
        { 
          id: 'in_progress', 
          name: 'En Progreso', 
          color: 'blue', 
          order: 3, 
          automations: [
            {
              id: '9',
              type: 'ai_message',
              action: 'Actualización de progreso',
              prompt: 'Hola {nombre}, tu ticket #{ticket_id} está siendo trabajado por {tecnico}. Te mantendremos informado del progreso. Si tienes información adicional que pueda ayudar, no dudes en compartirla.'
            }
          ],
          aiPrompt: 'Monitorear progreso y detectar bloqueos. Variables: {progreso}, {bloqueos}, {tiempo_transcurrido}',
          systemVariables: ['{nombre}', '{ticket_id}', '{tecnico}', '{progreso}', '{tiempo_transcurrido}', '{bloqueos}']
        },
        { 
          id: 'resolved', 
          name: 'Resuelto', 
          color: 'green', 
          order: 4, 
          automations: [
            {
              id: '10',
              type: 'ai_message',
              action: 'Confirmación de resolución',
              prompt: 'Hola {nombre}, nos complace informarte que tu ticket #{ticket_id} ha sido resuelto. La solución implementada fue: {solucion}. Por favor confirma si todo funciona correctamente. ¡Gracias por tu paciencia!'
            }
          ],
          aiPrompt: 'Confirmar resolución y solicitar feedback. Variables: {solucion}, {satisfaccion}',
          systemVariables: ['{nombre}', '{ticket_id}', '{solucion}', '{tiempo_resolucion}', '{satisfaccion}']
        }
      ]
    },
    {
      id: 'ecommerce',
      name: 'Pipeline E-commerce',
      description: 'Gestión de leads de tienda online',
      icon: ShoppingCart,
      color: 'purple',
      phases: [
        { 
          id: 'visitor', 
          name: 'Visitante Web', 
          color: 'gray', 
          order: 1, 
          automations: [
            {
              id: '11',
              type: 'ai_message',
              action: 'Mensaje de bienvenida tienda',
              prompt: '¡Hola! 👋 Bienvenido a {tienda}. Veo que estás navegando por {categoria}. ¿Hay algo específico que estés buscando? Estoy aquí para ayudarte a encontrar el producto perfecto.'
            }
          ],
          aiPrompt: 'Analizar comportamiento de navegación y productos de interés. Variables: {paginas_vistas}, {tiempo_sesion}, {productos_vistos}',
          systemVariables: ['{nombre}', '{tienda}', '{categoria}', '{paginas_vistas}', '{tiempo_sesion}', '{productos_vistos}']
        },
        { 
          id: 'interested', 
          name: 'Interesado', 
          color: 'blue', 
          order: 2, 
          automations: [
            {
              id: '12',
              type: 'ai_message',
              action: 'Oferta personalizada',
              prompt: 'Hola {nombre}, veo que has mostrado interés en {producto}. Tengo una oferta especial para ti: {descuento}% de descuento si compras hoy. ¿Te interesa conocer más detalles?'
            }
          ],
          aiPrompt: 'Personalizar oferta según productos de interés. Variables: {producto_interes}, {historial_compras}, {descuento_aplicable}',
          systemVariables: ['{nombre}', '{producto}', '{descuento}', '{producto_interes}', '{historial_compras}']
        },
        { 
          id: 'cart_abandoned', 
          name: 'Carrito Abandonado', 
          color: 'orange', 
          order: 3, 
          automations: [
            {
              id: '13',
              type: 'ai_message',
              action: 'Recuperación de carrito',
              prompt: 'Hola {nombre}, veo que dejaste algunos productos increíbles en tu carrito: {productos_carrito}. ¿Hubo algún problema? Puedo ayudarte a completar tu compra y aplicar un descuento especial del {descuento_recuperacion}%.'
            }
          ],
          aiPrompt: 'Estrategia de recuperación según valor del carrito. Variables: {valor_carrito}, {productos_carrito}, {motivo_abandono}',
          systemVariables: ['{nombre}', '{productos_carrito}', '{valor_carrito}', '{descuento_recuperacion}', '{motivo_abandono}']
        },
        { 
          id: 'purchased', 
          name: 'Compra Realizada', 
          color: 'green', 
          order: 4, 
          automations: [
            {
              id: '14',
              type: 'ai_message',
              action: 'Confirmación y upsell',
              prompt: '¡Gracias por tu compra {nombre}! Tu pedido #{pedido} está confirmado. Te llegará a {direccion} en {tiempo_entrega}. Por cierto, otros clientes que compraron {producto} también adquirieron {producto_relacionado}. ¿Te interesa?'
            }
          ],
          aiPrompt: 'Confirmar compra y sugerir productos complementarios. Variables: {pedido}, {productos_comprados}, {productos_relacionados}',
          systemVariables: ['{nombre}', '{pedido}', '{direccion}', '{tiempo_entrega}', '{producto}', '{producto_relacionado}']
        }
      ]
    }
  ];

  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'María González',
      email: 'maria@techsolutions.com',
      phone: '+34 666 777 888',
      company: 'Tech Solutions SL',
      position: 'CTO',
      phaseId: 'lead',
      priority: 'alta',
      source: 'WhatsApp',
      value: 15000,
      lastContact: '2 min',
      assignedTo: 'Juan Pérez',
      tags: ['Enterprise', 'Urgente', 'SaaS'],
      tasks: [
        { id: '1', title: 'Enviar propuesta técnica', completed: false, dueDate: '2024-01-15' },
        { id: '2', title: 'Agendar demo', completed: true }
      ],
      notes: 'Cliente muy interesado en solución enterprise. Presupuesto confirmado de 15K. Necesita implementación antes de Q2.',
      status: 'active',
      createdAt: '2024-01-10',
      lastActivity: 'Mensaje recibido hace 2 min'
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      email: 'carlos@startupxyz.com',
      phone: '+34 555 444 333',
      company: 'StartupXYZ',
      position: 'CEO',
      phaseId: 'qualified',
      priority: 'media',
      source: 'Web',
      value: 8500,
      lastContact: '1 hora',
      assignedTo: 'Ana López',
      tags: ['Startup', 'SaaS', 'Escalable'],
      tasks: [
        { id: '3', title: 'Validar presupuesto', completed: false, dueDate: '2024-01-16' },
        { id: '4', title: 'Enviar caso de éxito similar', completed: false, dueDate: '2024-01-17' }
      ],
      notes: 'Startup en crecimiento, necesita solución escalable. Interesado en plan anual con descuento.',
      status: 'active',
      createdAt: '2024-01-09',
      lastActivity: 'Llamada programada para mañana'
    },
    {
      id: '3',
      name: 'Laura Martín',
      email: 'laura@corporacionabc.com',
      phone: '+34 777 888 999',
      company: 'Corporación ABC',
      position: 'Directora IT',
      phaseId: 'proposal',
      priority: 'alta',
      source: 'Referido',
      value: 25000,
      lastContact: '3 horas',
      assignedTo: 'Juan Pérez',
      tags: ['Enterprise', 'Migración', 'Corporativo'],
      tasks: [
        { id: '5', title: 'Revisar contrato', completed: false, dueDate: '2024-01-17' },
        { id: '6', title: 'Presentación ejecutiva', completed: true },
        { id: '7', title: 'Validar requerimientos técnicos', completed: true }
      ],
      notes: 'Proyecto de migración completa de sistemas legacy. Decisión en junta directiva próxima semana.',
      status: 'active',
      createdAt: '2024-01-05',
      lastActivity: 'Propuesta enviada y revisada'
    },
    {
      id: '4',
      name: 'Pedro Sánchez',
      email: 'pedro@pymeinnovadora.com',
      phone: '+34 333 222 111',
      company: 'PYME Innovadora',
      position: 'Gerente General',
      phaseId: 'negotiation',
      priority: 'alta',
      source: 'WhatsApp',
      value: 12000,
      lastContact: '1 día',
      assignedTo: 'Ana López',
      tags: ['PYME', 'Descuento', 'Precio'],
      tasks: [
        { id: '8', title: 'Preparar propuesta con descuento', completed: false, dueDate: '2024-01-18' },
        { id: '9', title: 'Llamada de cierre', completed: false, dueDate: '2024-01-19' }
      ],
      notes: 'Negociando descuento por volumen. Muy interesado pero sensible al precio. Competencia activa.',
      status: 'active',
      createdAt: '2024-01-08',
      lastActivity: 'Negociando términos comerciales'
    },
    {
      id: '5',
      name: 'Ana Rodríguez',
      email: 'ana@exitocorp.com',
      phone: '+34 888 999 000',
      company: 'Éxito Corp',
      position: 'VP Ventas',
      phaseId: 'closed_won',
      priority: 'alta',
      source: 'LinkedIn',
      value: 18000,
      lastContact: '2 días',
      assignedTo: 'Juan Pérez',
      tags: ['Ganado', 'Onboarding', 'Premium'],
      tasks: [
        { id: '10', title: 'Iniciar onboarding', completed: true },
        { id: '11', title: 'Asignar account manager', completed: true },
        { id: '12', title: 'Programar kick-off', completed: false, dueDate: '2024-01-20' }
      ],
      notes: 'Cliente ganado! Muy satisfecho con la propuesta. Inicio de implementación programado.',
      status: 'won',
      createdAt: '2024-01-03',
      lastActivity: 'Contrato firmado'
    }
  ];

  const currentPipeline = mockPipelines.find(p => p.id === selectedPipeline) || mockPipelines[0];
  const filteredLeads = mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const totalLeads = filteredLeads.length;
  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = filteredLeads.length > 0 ? (filteredLeads.filter(l => l.status === 'won').length / filteredLeads.length * 100) : 0;

  const getPhaseColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      alta: 'bg-red-100 text-red-700 border-red-200',
      media: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      baja: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.media;
  };

  const getLeadsByPhase = (phaseId: string) => {
    return filteredLeads.filter(lead => lead.phaseId === phaseId);
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, phaseId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPhase(phaseId);
  };

  const handleDragLeave = () => {
    setDragOverPhase(null);
  };

  const handleDrop = (e: React.DragEvent, phaseId: string) => {
    e.preventDefault();
    setDragOverPhase(null);
    
    if (draggedLead && draggedLead.phaseId !== phaseId) {
      const targetPhase = currentPipeline.phases.find(p => p.id === phaseId);
      const sourcePhase = currentPipeline.phases.find(p => p.id === draggedLead.phaseId);
      
      if (targetPhase && sourcePhase) {
        // Si la fase tiene automatizaciones, mostrar modal
        if (targetPhase.automations.length > 0 || targetPhase.aiPrompt) {
          setShowAutomationModal({
            leadId: draggedLead.id,
            fromPhase: sourcePhase.name,
            toPhase: targetPhase.name
          });
        } else {
          // Mover directamente
          console.log(`Moviendo lead ${draggedLead.name} de ${sourcePhase.name} a ${targetPhase.name}`);
          // Aquí se actualizaría el estado del lead
        }
      }
    }
    setDraggedLead(null);
  };

  const handlePhaseNameEdit = (phaseId: string, newName: string) => {
    console.log(`Editando fase ${phaseId} con nuevo nombre: ${newName}`);
    setEditingPhase(null);
  };

  const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => {
    const pendingTasks = lead.tasks.filter(task => !task.completed).length;
    const [showQuickActions, setShowQuickActions] = useState(false);
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, lead)}
        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-move group mb-3 ${
          draggedLead?.id === lead.id ? 'opacity-50 scale-95' : ''
        }`}
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate text-sm">{lead.name}</h4>
              {lead.company && (
                <p className="text-xs text-gray-500 truncate flex items-center mt-1">
                  <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                  {lead.company}
                </p>
              )}
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowEditLead(lead.id);
              }}
              className={`p-1 hover:bg-gray-100 rounded-full transition-opacity ${
                showQuickActions ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Priority and Value */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
            {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
          </span>
          <span className="text-sm font-bold text-green-600">
            €{lead.value.toLocaleString()}
          </span>
        </div>

        {/* Tags */}
        {lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {lead.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                {tag}
              </span>
            ))}
            {lead.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{lead.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Status Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>hace {lead.lastContact}</span>
            </div>
            {pendingTasks > 0 && (
              <div className="flex items-center space-x-1 text-orange-600">
                <CheckCircle className="w-3 h-3" />
                <span>{pendingTasks}</span>
              </div>
            )}
          </div>
          <span className="truncate max-w-20 text-xs">{lead.assignedTo}</span>
        </div>

        {/* Quick Actions */}
        <div className={`transition-all duration-200 ${
          showQuickActions ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                  title="Llamar"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Llamando a ${lead.name}: ${lead.phone}`);
                  }}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                  title="Email"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Enviando email a ${lead.email}`);
                  }}
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                  title="WhatsApp"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Abriendo WhatsApp con ${lead.phone}`);
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLeadDetail(lead.id);
                }}
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center space-x-1 px-2 py-1 hover:bg-gray-50 rounded"
              >
                <Eye className="w-3 h-3" />
                <span>Ver</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PipelineEditor: React.FC = () => {
    const [editingPipeline, setEditingPipeline] = useState(currentPipeline);
    const [activeTab, setActiveTab] = useState<'phases' | 'automations'>('phases');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-gray-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Editor de Pipeline</h2>
                <p className="text-sm text-gray-500">{editingPipeline.name}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPipelineEditor(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('phases')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'phases'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Fases del Pipeline</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('automations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'automations'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>Automatizaciones IA</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'phases' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Configuración de Fases</h3>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    <span>Agregar Fase</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {editingPipeline.phases.map((phase, index) => (
                    <div key={phase.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          </div>
                          <input
                            type="text"
                            value={phase.name}
                            className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                            onChange={(e) => {
                              const updatedPhases = [...editingPipeline.phases];
                              updatedPhases[index] = { ...phase, name: e.target.value };
                              setEditingPipeline({ ...editingPipeline, phases: updatedPhases });
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={phase.color}
                            onChange={(e) => {
                              const updatedPhases = [...editingPipeline.phases];
                              updatedPhases[index] = { ...phase, color: e.target.value };
                              setEditingPipeline({ ...editingPipeline, phases: updatedPhases });
                            }}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="blue">Azul</option>
                            <option value="yellow">Amarillo</option>
                            <option value="purple">Morado</option>
                            <option value="orange">Naranja</option>
                            <option value="green">Verde</option>
                            <option value="red">Rojo</option>
                            <option value="gray">Gris</option>
                          </select>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Prompt de IA para esta fase
                          </label>
                          <textarea
                            value={phase.aiPrompt || ''}
                            onChange={(e) => {
                              const updatedPhases = [...editingPipeline.phases];
                              updatedPhases[index] = { ...phase, aiPrompt: e.target.value };
                              setEditingPipeline({ ...editingPipeline, phases: updatedPhases });
                            }}
                            className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={3}
                            placeholder="Describe qué debe evaluar la IA cuando un lead llega a esta fase..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Variables del sistema disponibles
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {phase.systemVariables?.map((variable, vIndex) => (
                              <span key={vIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {variable}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-500">
                            {phase.automations.length} automatización(es)
                          </span>
                          <button className="text-xs text-green-600 hover:text-green-700 flex items-center space-x-1">
                            <Plus className="w-3 h-3" />
                            <span>Agregar automatización</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Automatizaciones por Fase</h3>
                  <p className="text-sm text-gray-600">
                    Configura las acciones automáticas que se ejecutarán cuando un lead se mueva a cada fase.
                  </p>
                </div>

                <div className="space-y-4">
                  {editingPipeline.phases.map((phase) => (
                    <div key={phase.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full bg-${phase.color}-500`}></div>
                          <h4 className="font-medium text-gray-900">{phase.name}</h4>
                        </div>
                        <button className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700">
                          <Plus className="w-4 h-4" />
                          <span>Nueva automatización</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {phase.automations.map((automation, index) => (
                          <div key={automation.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Bot className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium text-gray-900">
                                    {automation.action}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    automation.type === 'ai_message' ? 'bg-blue-100 text-blue-700' :
                                    automation.type === 'task' ? 'bg-yellow-100 text-yellow-700' :
                                    automation.type === 'assignment' ? 'bg-purple-100 text-purple-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {automation.type.replace('_', ' ')}
                                  </span>
                                </div>
                                {automation.prompt && (
                                  <div className="bg-white p-2 rounded border border-gray-200">
                                    <p className="text-xs text-gray-700 font-mono">{automation.prompt}</p>
                                  </div>
                                )}
                              </div>
                              <button className="p-1 hover:bg-gray-200 rounded ml-2">
                                <Edit3 className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {phase.automations.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No hay automatizaciones configuradas</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={() => setShowPipelineEditor(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                console.log('Guardando pipeline:', editingPipeline);
                setShowPipelineEditor(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AutomationModal: React.FC<{ automation: {leadId: string, fromPhase: string, toPhase: string} }> = ({ automation }) => {
    const lead = mockLeads.find(l => l.id === automation.leadId);
    const targetPhase = currentPipeline.phases.find(p => p.name === automation.toPhase);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    React.useEffect(() => {
      if (targetPhase?.automations[0]?.prompt) {
        // Reemplazar variables del sistema
        let processedMessage = targetPhase.automations[0].prompt;
        if (lead) {
          processedMessage = processedMessage
            .replace('{nombre}', lead.name)
            .replace('{empresa}', lead.company || '')
            .replace('{agente}', lead.assignedTo)
            .replace('{fecha}', new Date().toLocaleDateString())
            .replace('{presupuesto}', `€${lead.value.toLocaleString()}`);
        }
        setMessage(processedMessage);
      }
    }, [targetPhase, lead]);

    const handleExecuteAutomation = async () => {
      setIsProcessing(true);
      
      // Simular procesamiento IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Ejecutando automatización para ${lead?.name}:`);
      console.log(`- Moviendo de ${automation.fromPhase} a ${automation.toPhase}`);
      console.log(`- Mensaje: ${message}`);
      
      setIsProcessing(false);
      setShowAutomationModal(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Automatización Activada</h2>
                <p className="text-sm text-gray-500">
                  Moviendo {lead?.name} de {automation.fromPhase} a {automation.toPhase}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAutomationModal(null)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje automático que se enviará:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Análisis IA</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {targetPhase?.aiPrompt || 'La IA analizará automáticamente este lead y ejecutará las acciones configuradas.'}
                    </p>
                  </div>
                </div>
              </div>

              {targetPhase?.systemVariables && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variables disponibles:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {targetPhase.systemVariables.map((variable, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(prev => prev + ` ${variable}`)}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                      >
                        {variable}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={() => setShowAutomationModal(null)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleExecuteAutomation}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ejecutar Automatización</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NewLeadModal: React.FC = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      value: '',
      assignedTo: '',
      tags: '',
      notes: '',
      phaseId: currentPipeline.phases[0]?.id || '',
      priority: 'media' as 'alta' | 'media' | 'baja',
      source: 'WhatsApp'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Creando nuevo lead:', formData);
      setShowNewLeadModal(false);
      // Reset form
      setFormData({
        name: '', email: '', phone: '', company: '', position: '',
        value: '', assignedTo: '', tags: '', notes: '', phaseId: currentPipeline.phases[0]?.id || '',
        priority: 'media', source: 'WhatsApp'
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Nuevo Lead</h2>
            </div>
            <button 
              onClick={() => setShowNewLeadModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor estimado (€)
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as 'alta' | 'media' | 'baja'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignado a
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seleccionar usuario</option>
                  <option value="Juan Pérez">Juan Pérez</option>
                  <option value="Ana López">Ana López</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fase inicial
                </label>
                <select
                  value={formData.phaseId}
                  onChange={(e) => setFormData({...formData, phaseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {currentPipeline.phases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origen
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Web">Página Web</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referido">Referido</option>
                  <option value="Email">Email</option>
                  <option value="Llamada">Llamada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="Enterprise, Urgente, SaaS"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowNewLeadModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Crear Lead</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditLeadModal: React.FC<{ leadId: string }> = ({ leadId }) => {
    const lead = mockLeads.find(l => l.id === leadId);
    if (!lead) return null;

    const [formData, setFormData] = useState({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company || '',
      position: lead.position || '',
      value: lead.value.toString(),
      assignedTo: lead.assignedTo,
      tags: lead.tags.join(', '),
      notes: lead.notes,
      phaseId: lead.phaseId,
      priority: lead.priority,
      source: lead.source
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Actualizando lead:', formData);
      setShowEditLead(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Edit3 className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Editar Lead</h2>
                <p className="text-sm text-gray-500">{lead.name}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowEditLead(null)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor estimado (€)
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as 'alta' | 'media' | 'baja'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignado a
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Juan Pérez">Juan Pérez</option>
                  <option value="Ana López">Ana López</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fase actual
                </label>
                <select
                  value={formData.phaseId}
                  onChange={(e) => setFormData({...formData, phaseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currentPipeline.phases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origen
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Web">Página Web</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referido">Referido</option>
                  <option value="Email">Email</option>
                  <option value="Llamada">Llamada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="Enterprise, Urgente, SaaS"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowEditLead(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const LeadDetailModal: React.FC<{ leadId: string }> = ({ leadId }) => {
    const lead = mockLeads.find(l => l.id === leadId);
    if (!lead) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
                <p className="text-sm text-gray-500">{lead.company}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowLeadDetail(null)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Información Principal */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Información de Contacto</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{lead.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{lead.phone}</span>
                    </div>
                    {lead.position && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{lead.position}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Tareas</h3>
                  <div className="space-y-2">
                    {lead.tasks.map(task => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          onChange={() => console.log(`Toggle task ${task.id}`)}
                        />
                        <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {task.title}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">{task.dueDate}</span>
                        )}
                      </div>
                    ))}
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                      + Agregar tarea
                    </button>
                  </div>
                </div>

                {lead.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Notas</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{lead.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Lateral */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Detalles</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500">Valor</span>
                      <p className="font-semibold text-green-600">€{lead.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Prioridad</span>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                        {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Asignado a</span>
                      <p className="text-sm text-gray-700">{lead.assignedTo}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Origen</span>
                      <p className="text-sm text-gray-700">{lead.source}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Creado</span>
                      <p className="text-sm text-gray-700">{lead.createdAt}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Mover a Fase</h3>
                  <select 
                    value={lead.phaseId}
                    onChange={(e) => console.log(`Moviendo lead a fase: ${e.target.value}`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {currentPipeline.phases.map(phase => (
                      <option key={phase.id} value={phase.id}>
                        {phase.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <MessageSquare className="w-4 h-4" />
                    <span>Enviar WhatsApp</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Phone className="w-4 h-4" />
                    <span>Llamar</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    <Zap className="w-4 h-4" />
                    <span>Automatización IA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TableView: React.FC = () => {
    const [sortField, setSortField] = useState<keyof Lead>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortedLeads = [...filteredLeads].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    const handleSort = (field: keyof Lead) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Lead</span>
                    {sortField === 'name' && (
                      <ArrowRight className={`w-3 h-3 transform ${sortDirection === 'desc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('phaseId')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Fase</span>
                    {sortField === 'phaseId' && (
                      <ArrowRight className={`w-3 h-3 transform ${sortDirection === 'desc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('value')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Valor</span>
                    {sortField === 'value' && (
                      <ArrowRight className={`w-3 h-3 transform ${sortDirection === 'desc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('priority')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Prioridad</span>
                    {sortField === 'priority' && (
                      <ArrowRight className={`w-3 h-3 transform ${sortDirection === 'desc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('lastContact')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Último Contacto</span>
                    {sortField === 'lastContact' && (
                      <ArrowRight className={`w-3 h-3 transform ${sortDirection === 'desc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedLeads.map((lead) => {
                const phase = currentPipeline.phases.find(p => p.id === lead.phaseId);
                const pendingTasks = lead.tasks.filter(task => !task.completed).length;
                
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {lead.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.company || '-'}</div>
                      <div className="text-sm text-gray-500">{lead.position || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPhaseColor(phase?.color || 'blue')}`}>
                        {phase?.name || 'Sin fase'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        €{lead.value.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(lead.priority)}`}>
                        {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.assignedTo}</div>
                      <div className="text-sm text-gray-500">{lead.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">hace {lead.lastContact}</div>
                      {pendingTasks > 0 && (
                        <div className="text-sm text-orange-600 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {pendingTasks} tarea(s)
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => console.log(`Llamando a ${lead.phone}`)}
                          className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                          title="Llamar"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => console.log(`Enviando email a ${lead.email}`)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => console.log(`Abriendo WhatsApp con ${lead.phone}`)}
                          className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setShowLeadDetail(lead.id)}
                          className="p-2 hover:bg-gray-50 rounded-lg text-gray-600"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setShowEditLead(lead.id)}
                          className="p-2 hover:bg-gray-50 rounded-lg text-gray-600"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron leads</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                <p className="text-gray-600">Gestiona tu pipeline de ventas</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Users className="w-4 h-4" />
                  <span>{totalLeads} leads</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                  <span>€{totalValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span>{conversionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowNewLeadModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Lead</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Pipeline Selector */}
              <div className="relative">
                <select
                  value={selectedPipeline}
                  onChange={(e) => setSelectedPipeline(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-48"
                >
                  {mockPipelines.map(pipeline => {
                    const Icon = pipeline.icon;
                    return (
                      <option key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {userRole === 'admin' && (
                <button 
                  onClick={() => setShowPipelineEditor(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Editar Pipeline"
                >
                  <Settings className="w-4 h-4" />
                  <span>Editar Pipeline</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
              </div>

              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType('kanban')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewType === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                  <span className="text-sm font-medium">Kanban</span>
                </button>
                <button
                  onClick={() => setViewType('table')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewType === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm font-medium">Tabla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Content */}
      <div className="p-6">
        {viewType === 'kanban' ? (
          <div className="flex space-x-6 overflow-x-auto pb-4" style={{ minWidth: 'fit-content' }}>
            {currentPipeline.phases.map((phase) => {
              const phaseLeads = getLeadsByPhase(phase.id);
              const phaseValue = phaseLeads.reduce((sum, lead) => sum + lead.value, 0);
              
              return (
                <div 
                  key={phase.id} 
                  className="flex-shrink-0 w-80"
                  onDragOver={(e) => handleDragOver(e, phase.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, phase.id)}
                >
                  <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                    dragOverPhase === phase.id ? 'border-green-400 bg-green-50' : 'border-gray-200'
                  }`}>
                    {/* Phase Header */}
                    <div className={`p-4 border-b border-gray-100 rounded-t-xl ${getPhaseColor(phase.color)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {editingPhase === phase.id ? (
                            <input
                              type="text"
                              defaultValue={phase.name}
                              onBlur={(e) => handlePhaseNameEdit(phase.id, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handlePhaseNameEdit(phase.id, e.currentTarget.value);
                                }
                              }}
                              className="font-semibold bg-transparent border-none focus:ring-0 p-0 text-sm"
                              autoFocus
                            />
                          ) : (
                            <h3 
                              className="font-semibold text-sm cursor-pointer hover:underline"
                              onClick={() => userRole === 'admin' && setEditingPhase(phase.id)}
                            >
                              {phase.name}
                            </h3>
                          )}
                          {userRole === 'admin' && (
                            <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{phaseLeads.length}</div>
                          <div className="text-xs opacity-75">€{phaseValue.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      {phase.aiPrompt && (
                        <div className="mt-2 flex items-center space-x-1 text-xs opacity-75">
                          <Bot className="w-3 h-3" />
                          <span>IA Configurada</span>
                        </div>
                      )}
                    </div>

                    {/* Phase Content */}
                    <div className="p-4 max-h-96 overflow-y-auto" style={{ minHeight: '200px' }}>
                      {phaseLeads.length > 0 ? (
                        phaseLeads.map((lead) => (
                          <LeadCard key={lead.id} lead={lead} />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Arrastra leads aquí</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <TableView />
        )}
      </div>

      {/* Modal Agregar Fase */}
      {showAddPhaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Agregar Nueva Fase</h2>
                <button
                  onClick={() => setShowAddPhaseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Fase
                  </label>
                  <input
                    type="text"
                    value={newPhase.name}
                    onChange={(e) => setNewPhase(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Propuesta Enviada"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de la Fase
                  </label>
                  <select
                    value={newPhase.color}
                    onChange={(e) => setNewPhase(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="blue">Azul</option>
                    <option value="green">Verde</option>
                    <option value="purple">Morado</option>
                    <option value="orange">Naranja</option>
                    <option value="red">Rojo</option>
                    <option value="yellow">Amarillo</option>
                    <option value="pink">Rosa</option>
                    <option value="indigo">Índigo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Automatización
                  </label>
                  <select
                    value={newPhase.automationType}
                    onChange={(e) => setNewPhase(prev => ({ ...prev, automationType: e.target.value as 'message' | 'task' | 'assignment' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="message">Enviar Mensaje</option>
                    <option value="task">Crear Tarea</option>
                    <option value="assignment">Asignar Responsable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt de Automatización
                  </label>
                  <textarea
                    value={newPhase.automationPrompt}
                    onChange={(e) => setNewPhase(prev => ({ ...prev, automationPrompt: e.target.value }))}
                    placeholder="Hola {nombre}, hemos recibido tu solicitud para {empresa}. Te contactaremos pronto con una propuesta personalizada."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Variables disponibles: {'{nombre}'}, {'{empresa}'}, {'{presupuesto}'}, {'{telefono}'}, {'{email}'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddPhaseModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPhase}
                  disabled={!newPhase.name.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar Fase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{totalLeads} leads totales</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>€{totalValue.toLocaleString()} en pipeline</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>{conversionRate.toFixed(1)}% tasa de conversión</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>{currentPipeline.name}</span>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showNewLeadModal && <NewLeadModal />}
      {showLeadDetail && <LeadDetailModal leadId={showLeadDetail} />}
      {showEditLead && <EditLeadModal leadId={showEditLead} />}
      {showPipelineEditor && <PipelineEditor />}
      {showAutomationModal && <AutomationModal automation={showAutomationModal} />}
    </div>
  );
};

export default Leads;