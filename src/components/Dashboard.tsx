import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Filter,
  Calendar,
  Download,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronDown,
  Target,
  DollarSign,
  Activity,
  Zap,
  FileText,
  UserPlus,
  MessageSquare,
  CheckSquare,
  BarChart3,
  PieChart,
  TrendingDown,
  Info,
  RefreshCw,
  ExternalLink,
  Globe,
  Smartphone,
  Mail,
  QrCode,
  Star,
  Award,
  Timer,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import type { UserRole } from '../App';

interface DashboardProps {
  userRole: UserRole;
}

interface KPI {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: any;
  color: string;
  description: string;
  formula: string;
  trend: number[];
  action: string;
}

interface FilterState {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  customDateStart: string;
  customDateEnd: string;
  responsible: string;
  leadSource: string;
  leadStatus: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: string;
  leadId?: string;
}

interface Activity {
  id: string;
  type: 'lead' | 'message' | 'task' | 'conversion' | 'call' | 'email';
  title: string;
  description: string;
  time: string;
  user: string;
  leadId?: string;
  icon: any;
  color: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFAB, setShowFAB] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'month',
    customDateStart: '',
    customDateEnd: '',
    responsible: 'all',
    leadSource: 'all',
    leadStatus: 'all'
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Seguimiento María González',
      description: 'Llamar para confirmar demo programada',
      dueDate: 'Hoy 15:00',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Juan Pérez',
      leadId: 'lead-1'
    },
    {
      id: '2',
      title: 'Enviar propuesta Carlos Ruiz',
      description: 'Preparar cotización personalizada',
      dueDate: 'Mañana 10:00',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Ana López'
    },
    {
      id: '3',
      title: 'Demo Ana López',
      description: 'Presentación del sistema de inventarios',
      dueDate: 'Ayer 16:00',
      priority: 'high',
      status: 'overdue',
      assignedTo: 'María García'
    }
  ]);

  const texts = {
    es: {
      dashboard: 'Dashboard',
      summary: 'Resumen general de tu actividad',
      filters: 'Filtros',
      applyFilters: 'Aplicar Filtros',
      clearFilters: 'Limpiar Filtros',
      today: 'Hoy',
      week: 'Semana',
      month: 'Mes',
      custom: 'Personalizado',
      all: 'Todos',
      loading: 'Cargando...',
      noData: 'No hay datos disponibles',
      recentActivity: 'Actividad Reciente',
      quickTasks: 'Tareas Rápidas',
      salesFunnel: 'Embudo de Ventas',
      leadSources: 'Fuentes de Leads',
      newTask: 'Nueva Tarea',
      newLead: 'Nuevo Lead',
      newChat: 'Nuevo Chat',
      viewAll: 'Ver Todo',
      export: 'Exportar',
      details: 'Ver Detalle'
    },
    en: {
      dashboard: 'Dashboard',
      summary: 'General overview of your activity',
      filters: 'Filters',
      applyFilters: 'Apply Filters',
      clearFilters: 'Clear Filters',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      custom: 'Custom',
      all: 'All',
      loading: 'Loading...',
      noData: 'No data available',
      recentActivity: 'Recent Activity',
      quickTasks: 'Quick Tasks',
      salesFunnel: 'Sales Funnel',
      leadSources: 'Lead Sources',
      newTask: 'New Task',
      newLead: 'New Lead',
      newChat: 'New Chat',
      viewAll: 'View All',
      export: 'Export',
      details: 'View Details'
    }
  };

  const t = texts[language];

  const kpis: KPI[] = [
    {
      id: 'active-leads',
      title: language === 'es' ? 'Leads Activos' : 'Active Leads',
      value: '247',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      description: language === 'es' ? 'Leads en proceso de conversión' : 'Leads in conversion process',
      formula: language === 'es' ? 'Total de leads no cerrados' : 'Total non-closed leads',
      trend: [45, 52, 48, 61, 55, 67, 73],
      action: language === 'es' ? 'Ver leads activos' : 'View active leads'
    },
    {
      id: 'won-leads',
      title: language === 'es' ? 'Leads Ganados' : 'Won Leads',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: Award,
      color: 'green',
      description: language === 'es' ? 'Leads convertidos exitosamente' : 'Successfully converted leads',
      formula: language === 'es' ? 'Leads con estado "Ganado"' : 'Leads with "Won" status',
      trend: [12, 15, 18, 22, 28, 31, 35],
      action: language === 'es' ? 'Ver conversiones' : 'View conversions'
    },
    {
      id: 'lost-leads',
      title: language === 'es' ? 'Leads Perdidos' : 'Lost Leads',
      value: '34',
      change: '-8%',
      changeType: 'positive',
      icon: TrendingDown,
      color: 'red',
      description: language === 'es' ? 'Leads que no se convirtieron' : 'Leads that did not convert',
      formula: language === 'es' ? 'Leads con estado "Perdido"' : 'Leads with "Lost" status',
      trend: [42, 38, 35, 32, 30, 28, 34],
      action: language === 'es' ? 'Analizar pérdidas' : 'Analyze losses'
    },
    {
      id: 'response-time',
      title: language === 'es' ? 'Tiempo de Respuesta' : 'Response Time',
      value: '4.2 min',
      change: '-0.8 min',
      changeType: 'positive',
      icon: Timer,
      color: 'orange',
      description: language === 'es' ? 'Tiempo promedio de primera respuesta' : 'Average first response time',
      formula: language === 'es' ? 'Promedio de tiempo hasta primera respuesta' : 'Average time to first response',
      trend: [6.2, 5.8, 5.1, 4.9, 4.5, 4.3, 4.2],
      action: language === 'es' ? 'Mejorar tiempos' : 'Improve times'
    },
    {
      id: 'conversion-rate',
      title: language === 'es' ? 'Tasa de Conversión' : 'Conversion Rate',
      value: '23.4%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      color: 'purple',
      description: language === 'es' ? 'Porcentaje de leads que se convierten' : 'Percentage of leads that convert',
      formula: language === 'es' ? '(Leads Ganados / Total Leads) × 100' : '(Won Leads / Total Leads) × 100',
      trend: [18.2, 19.1, 20.5, 21.2, 22.1, 22.8, 23.4],
      action: language === 'es' ? 'Optimizar conversión' : 'Optimize conversion'
    },
    {
      id: 'pending-tasks',
      title: language === 'es' ? 'Tareas Pendientes' : 'Pending Tasks',
      value: '12',
      change: '+3',
      changeType: 'negative',
      icon: CheckSquare,
      color: 'yellow',
      description: language === 'es' ? 'Tareas sin completar' : 'Uncompleted tasks',
      formula: language === 'es' ? 'Total de tareas con estado pendiente' : 'Total tasks with pending status',
      trend: [8, 9, 11, 10, 12, 11, 12],
      action: language === 'es' ? 'Completar tareas' : 'Complete tasks'
    },
    {
      id: 'unanswered-chats',
      title: language === 'es' ? 'Chats Sin Responder' : 'Unanswered Chats',
      value: '5',
      change: '-2',
      changeType: 'positive',
      icon: MessageCircle,
      color: 'indigo',
      description: language === 'es' ? 'Conversaciones pendientes de respuesta' : 'Conversations pending response',
      formula: language === 'es' ? 'Chats con mensajes no respondidos' : 'Chats with unresponded messages',
      trend: [9, 8, 7, 6, 7, 5, 5],
      action: language === 'es' ? 'Responder chats' : 'Answer chats'
    },
    {
      id: 'revenue',
      title: language === 'es' ? 'Ingresos del Mes' : 'Monthly Revenue',
      value: '€45,230',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'emerald',
      description: language === 'es' ? 'Ingresos generados este mes' : 'Revenue generated this month',
      formula: language === 'es' ? 'Suma de valores de leads ganados' : 'Sum of won leads values',
      trend: [32000, 35000, 38000, 41000, 43000, 44000, 45230],
      action: language === 'es' ? 'Ver ingresos' : 'View revenue'
    }
  ];

  const funnelData = [
    { phase: language === 'es' ? 'Nuevo' : 'New', count: 247, percentage: 100, color: 'bg-blue-500' },
    { phase: language === 'es' ? 'Contactado' : 'Contacted', count: 198, percentage: 80, color: 'bg-green-500' },
    { phase: language === 'es' ? 'Interesado' : 'Interested', count: 156, percentage: 63, color: 'bg-yellow-500' },
    { phase: language === 'es' ? 'Propuesta' : 'Proposal', count: 124, percentage: 50, color: 'bg-orange-500' },
    { phase: language === 'es' ? 'Negociación' : 'Negotiation', count: 98, percentage: 40, color: 'bg-purple-500' },
    { phase: language === 'es' ? 'Cerrado' : 'Closed', count: 89, percentage: 36, color: 'bg-emerald-500' }
  ];

  const leadSources = [
    { name: 'WhatsApp', count: 156, percentage: 45, color: 'bg-green-500', icon: MessageSquare },
    { name: 'QR Code', count: 89, percentage: 26, color: 'bg-blue-500', icon: QrCode },
    { name: 'Web Form', count: 67, percentage: 19, color: 'bg-purple-500', icon: Globe },
    { name: 'Email', count: 23, percentage: 7, color: 'bg-orange-500', icon: Mail },
    { name: 'Phone', count: 12, percentage: 3, color: 'bg-indigo-500', icon: Phone }
  ];

  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'lead',
      title: language === 'es' ? 'Nuevo lead registrado' : 'New lead registered',
      description: 'María González - Interesada en servicio premium',
      time: '2 min',
      user: 'Sistema',
      leadId: 'lead-1',
      icon: UserPlus,
      color: 'blue'
    },
    {
      id: '2',
      type: 'message',
      title: language === 'es' ? 'Mensaje recibido' : 'Message received',
      description: 'Carlos Ruiz pregunta sobre precios',
      time: '5 min',
      user: 'WhatsApp Bot',
      icon: MessageCircle,
      color: 'green'
    },
    {
      id: '3',
      type: 'task',
      title: language === 'es' ? 'Tarea completada' : 'Task completed',
      description: 'Demo programada con Ana López',
      time: '15 min',
      user: 'Juan Pérez',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      id: '4',
      type: 'conversion',
      title: language === 'es' ? 'Lead convertido' : 'Lead converted',
      description: 'Pedro Martín completó la compra - €2,500',
      time: '1 hora',
      user: 'María García',
      icon: Award,
      color: 'emerald'
    },
    {
      id: '5',
      type: 'call',
      title: language === 'es' ? 'Llamada realizada' : 'Call made',
      description: 'Seguimiento con cliente potencial',
      time: '2 horas',
      user: 'Ana López',
      icon: Phone,
      color: 'orange'
    }
  ];

  const applyFilters = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setActiveFilter('applied');
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
    message.textContent = language === 'es' ? 'Filtros aplicados correctamente' : 'Filters applied successfully';
    document.body.appendChild(message);
    setTimeout(() => {
      message.remove();
    }, 3000);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: 'month',
      customDateStart: '',
      customDateEnd: '',
      responsible: 'all',
      leadSource: 'all',
      leadStatus: 'all'
    });
    setActiveFilter(null);
  };

  const handleKPIClick = (kpiId: string) => {
    setActiveFilter(kpiId);
    // Navigate to filtered section
    console.log(`Navigating to filtered view for: ${kpiId}`);
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const exportData = (type: string) => {
    console.log(`Exporting ${type} data...`);
    // Simulate export
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    message.textContent = language === 'es' ? 'Exportando datos...' : 'Exporting data...';
    document.body.appendChild(message);
    setTimeout(() => {
      message.textContent = language === 'es' ? 'Datos exportados correctamente' : 'Data exported successfully';
      setTimeout(() => message.remove(), 2000);
    }, 1000);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex items-center space-x-4">
            <RefreshCw className="w-6 h-6 text-green-600 animate-spin" />
            <span className="text-lg font-medium text-gray-900">{t.loading}</span>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.dashboard}</h1>
              <p className="text-gray-600">
                {t.summary} {userRole === 'admin' ? (language === 'es' ? 'y del equipo' : 'and team') : (language === 'es' ? 'personal' : 'personal')}
              </p>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{t.filters}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'es' ? 'Período' : 'Period'}
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="today">{t.today}</option>
                    <option value="week">{t.week}</option>
                    <option value="month">{t.month}</option>
                    <option value="custom">{t.custom}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'es' ? 'Responsable' : 'Responsible'}
                  </label>
                  <select
                    value={filters.responsible}
                    onChange={(e) => setFilters(prev => ({ ...prev, responsible: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">{t.all}</option>
                    <option value="juan">Juan Pérez</option>
                    <option value="ana">Ana López</option>
                    <option value="maria">María García</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'es' ? 'Fuente' : 'Source'}
                  </label>
                  <select
                    value={filters.leadSource}
                    onChange={(e) => setFilters(prev => ({ ...prev, leadSource: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">{t.all}</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="qr">QR Code</option>
                    <option value="web">Web Form</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'es' ? 'Estado' : 'Status'}
                  </label>
                  <select
                    value={filters.leadStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, leadStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">{t.all}</option>
                    <option value="active">{language === 'es' ? 'Activo' : 'Active'}</option>
                    <option value="won">{language === 'es' ? 'Ganado' : 'Won'}</option>
                    <option value="lost">{language === 'es' ? 'Perdido' : 'Lost'}</option>
                  </select>
                </div>

                <div className="flex items-end space-x-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t.applyFilters}
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {activeFilter && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      {language === 'es' ? 'Filtros aplicados' : 'Filters applied'} - {activeFilter}
                    </span>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {t.clearFilters}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                onClick={() => handleKPIClick(kpi.id)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(kpi.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      kpi.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <ArrowUpRight className={`w-3 h-3 ${kpi.changeType === 'negative' ? 'rotate-180' : ''}`} />
                      <span>{kpi.change}</span>
                    </div>
                    <div className="relative group">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <p className="font-medium mb-1">{kpi.description}</p>
                        <p className="text-gray-300 mb-2">{kpi.formula}</p>
                        <p className="text-green-300">{kpi.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                </div>

                {/* Mini trend chart */}
                <div className="flex items-end space-x-1 h-8">
                  {kpi.trend.map((value, index) => (
                    <div
                      key={index}
                      className={`bg-${kpi.color}-200 rounded-sm transition-all duration-300 group-hover:bg-${kpi.color}-300`}
                      style={{ 
                        height: `${(value / Math.max(...kpi.trend)) * 100}%`,
                        width: '8px'
                      }}
                    />
                  ))}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Funnel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{t.salesFunnel}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportData('funnel')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t.export}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {funnelData.map((stage, index) => (
                <div
                  key={stage.phase}
                  onClick={() => handleKPIClick(`funnel-${stage.phase.toLowerCase()}`)}
                  className="cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{stage.phase}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{stage.count}</span>
                      <span className="text-xs text-gray-500">({stage.percentage}%)</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${stage.color} h-3 rounded-full transition-all duration-500 group-hover:opacity-80`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{t.leadSources}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setChartType(chartType === 'pie' ? 'bar' : 'pie')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title={chartType === 'pie' ? 'Bar Chart' : 'Pie Chart'}
                >
                  {chartType === 'pie' ? <BarChart3 className="w-4 h-4" /> : <PieChart className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => exportData('sources')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {chartType === 'pie' ? (
              <div className="space-y-4">
                {leadSources.map((source) => {
                  const Icon = source.icon;
                  return (
                    <div
                      key={source.name}
                      onClick={() => handleKPIClick(`source-${source.name.toLowerCase()}`)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${source.color} text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">{source.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">{source.count}</span>
                        <span className="text-xs text-gray-500">({source.percentage}%)</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`${source.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${source.percentage * 2}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {leadSources.map((source) => {
                  const Icon = source.icon;
                  return (
                    <div key={source.name} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${source.color} text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{source.name}</span>
                          <span className="text-sm text-gray-600">{source.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${source.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${source.percentage * 2}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Activity and Tasks Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{t.recentActivity}</h3>
                  <button
                    onClick={() => console.log('View all activity')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    {t.viewAll}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        onClick={() => activity.leadId && console.log(`Navigate to lead: ${activity.leadId}`)}
                        className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                              {activity.title}
                            </p>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {language === 'es' ? 'hace' : ''} {activity.time} {language === 'en' ? 'ago' : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.user}</p>
                        </div>
                        {activity.leadId && (
                          <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tasks */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t.quickTasks}</h3>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  title={t.newTask}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {tasks.filter(task => task.status !== 'completed').map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTaskComplete(task.id)}
                          className="w-4 h-4 border-2 border-gray-300 rounded hover:border-green-500 transition-colors"
                        />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTaskPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTaskEdit(task)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full ${getTaskStatusColor(task.status)}`}>
                        {task.status === 'overdue' ? (language === 'es' ? 'Vencida' : 'Overdue') : 
                         task.status === 'pending' ? (language === 'es' ? 'Pendiente' : 'Pending') : 
                         (language === 'es' ? 'Completada' : 'Completed')}
                      </span>
                      <span className="text-gray-500">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowLeadModal(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">{t.newLead}</span>
                </button>
                <button
                  onClick={() => setShowChatModal(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{t.newChat}</span>
                </button>
                <button
                  onClick={() => exportData('dashboard')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">{t.export}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="relative">
          <button
            onClick={() => setShowFAB(!showFAB)}
            className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center hover:scale-110"
          >
            <Plus className={`w-6 h-6 transition-transform duration-300 ${showFAB ? 'rotate-45' : ''}`} />
          </button>

          {showFAB && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
              <button
                onClick={() => {
                  setShowLeadModal(true);
                  setShowFAB(false);
                }}
                className="flex items-center space-x-3 bg-white text-gray-700 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{t.newLead}</span>
              </button>
              <button
                onClick={() => {
                  setShowTaskModal(true);
                  setShowFAB(false);
                }}
                className="flex items-center space-x-3 bg-white text-gray-700 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              >
                <CheckSquare className="w-5 h-5 text-purple-600" />
                <span className="font-medium">{t.newTask}</span>
              </button>
              <button
                onClick={() => {
                  setShowChatModal(true);
                  setShowFAB(false);
                }}
                className="flex items-center space-x-3 bg-white text-gray-700 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              >
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span className="font-medium">{t.newChat}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTask ? (language === 'es' ? 'Editar Tarea' : 'Edit Task') : t.newTask}
              </h3>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setSelectedTask(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Título' : 'Title'}
                </label>
                <input
                  type="text"
                  defaultValue={selectedTask?.title || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={language === 'es' ? 'Título de la tarea' : 'Task title'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Descripción' : 'Description'}
                </label>
                <textarea
                  defaultValue={selectedTask?.description || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={language === 'es' ? 'Descripción de la tarea' : 'Task description'}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'es' ? 'Prioridad' : 'Priority'}
                  </label>
                  <select
                    defaultValue={selectedTask?.priority || 'medium'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="high">{language === 'es' ? 'Alta' : 'High'}</option>
                    <option value="medium">{language === 'es' ? 'Media' : 'Medium'}</option>
                    <option value="low">{language === 'es' ? 'Baja' : 'Low'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'es' ? 'Fecha límite' : 'Due date'}
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedTask(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedTask(null);
                    // Handle save
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {language === 'es' ? 'Guardar' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.newLead}</h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Nombre' : 'Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={language === 'es' ? 'Nombre del lead' : 'Lead name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Empresa' : 'Company'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={language === 'es' ? 'Nombre de la empresa' : 'Company name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Teléfono' : 'Phone'}
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+34 666 777 888"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Interés' : 'Interest'}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="">{language === 'es' ? 'Seleccionar interés' : 'Select interest'}</option>
                  <option value="software">Software CRM</option>
                  <option value="consulting">{language === 'es' ? 'Consultoría' : 'Consulting'}</option>
                  <option value="hosting">Hosting</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {language === 'es' ? 'Crear Lead' : 'Create Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.newChat}</h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Buscar Lead' : 'Search Lead'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={language === 'es' ? 'Buscar por nombre o teléfono' : 'Search by name or phone'}
                />
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'es' ? 'Leads recientes:' : 'Recent leads:'}
                </p>
                <div className="space-y-2">
                  {['María González', 'Carlos Ruiz', 'Ana López'].map((name) => (
                    <button
                      key={name}
                      onClick={() => setShowChatModal(false)}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowChatModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {language === 'es' ? 'Iniciar Chat' : 'Start Chat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;