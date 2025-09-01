import React, { useState, useRef } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Database,
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  Info,
  Bot,
  Settings as SettingsIcon,
  Users,
  MessageSquare,
  BarChart3,
  Zap
} from 'lucide-react';
import type { UserRole } from '../App';

interface SettingsProps {
  userRole: UserRole;
}

type SettingsTab = 'profile' | 'notifications' | 'preferences' | 'security' | 'database' | 'automation' | 'analytics';

interface DatabaseRecord {
  id: string;
  name: string;
  description: string;
  keywords: string;
  price: number;
  category: string;
  availability: boolean;
}

interface ValidationError {
  row: number;
  column: string;
  message: string;
}

const Settings: React.FC<SettingsProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [formData, setFormData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+34 666 777 888',
    position: 'Gerente de Ventas',
    location: 'Madrid, España',
    bio: 'Especialista en gestión de leads y conversiones con más de 5 años de experiencia.',
    notifications: {
      newLead: true,
      newMessage: true,
      leadStatusChange: false,
      dailyReport: true,
      weeklyReport: false
    },
    preferences: {
      language: 'es',
      timezone: 'Europe/Madrid',
      theme: 'light',
      autoResponse: false,
      showOnlineStatus: true
    }
  });

  // Database management state
  const [databaseState, setDatabaseState] = useState({
    products: {
      isLoaded: true,
      fileName: 'productos_servicios_2024.csv',
      recordCount: 247,
      lastUpdated: '15 de Enero, 2024',
      isUploading: false,
      uploadProgress: 0,
      validationErrors: [] as ValidationError[],
      previewData: [] as DatabaseRecord[]
    },
    onboarding: {
      isLoaded: true,
      fileName: 'onboarding_flujos_2024.csv',
      recordCount: 89,
      lastUpdated: '12 de Enero, 2024',
      isUploading: false,
      uploadProgress: 0,
      validationErrors: [] as ValidationError[],
      previewData: [] as DatabaseRecord[]
    },
    support: {
      isLoaded: true,
      fileName: 'soporte_tecnico_2024.csv',
      recordCount: 156,
      lastUpdated: '10 de Enero, 2024',
      isUploading: false,
      uploadProgress: 0,
      validationErrors: [] as ValidationError[],
      previewData: [] as DatabaseRecord[]
    }
  });

  const [legacyDatabaseState] = useState({
    isUploading: false,
    uploadProgress: 0,
    validationErrors: [] as ValidationError[],
    previewData: [] as DatabaseRecord[]
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [activeDatabaseTab, setActiveDatabaseTab] = useState<'products' | 'onboarding' | 'support'>('products');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Perfil', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notificaciones', icon: Bell },
    { id: 'preferences' as SettingsTab, label: 'Preferencias', icon: Palette },
    { id: 'database' as SettingsTab, label: 'Base de Datos', icon: Database },
    { id: 'automation' as SettingsTab, label: 'Automatización', icon: Bot },
    { id: 'analytics' as SettingsTab, label: 'Analíticas', icon: BarChart3 },
    ...(userRole === 'admin' ? [{ id: 'security' as SettingsTab, label: 'Seguridad', icon: Shield }] : [])
  ];

  const mockPreviewData: DatabaseRecord[] = [
    {
      id: '1',
      name: 'Software CRM Premium',
      description: 'Sistema completo de gestión de relaciones con clientes',
      keywords: 'crm, gestión, clientes, ventas, automatización',
      price: 299,
      category: 'Software',
      availability: true
    },
    {
      id: '2',
      name: 'Consultoría Digital',
      description: 'Asesoramiento en transformación digital empresarial',
      keywords: 'consultoría, digital, transformación, estrategia',
      price: 150,
      category: 'Servicios',
      availability: true
    },
    {
      id: '3',
      name: 'Hosting Empresarial',
      description: 'Alojamiento web profesional con soporte 24/7',
      keywords: 'hosting, web, servidor, dominio, ssl',
      price: 49,
      category: 'Hosting',
      availability: true
    }
  ];

  const mockOnboardingData = [
    {
      id: '1',
      name: 'Bienvenida Inicial',
      description: 'Mensaje de bienvenida para nuevos usuarios',
      keywords: 'hola, bienvenido, inicio, empezar',
      price: 0,
      category: 'Saludo',
      availability: true
    },
    {
      id: '2',
      name: 'Explicación de Servicios',
      description: 'Descripción general de todos nuestros servicios',
      keywords: 'servicios, qué hacemos, productos, ofrecemos',
      price: 0,
      category: 'Información',
      availability: true
    },
    {
      id: '3',
      name: 'Proceso de Compra',
      description: 'Guía paso a paso del proceso de compra',
      keywords: 'comprar, proceso, pasos, cómo funciona',
      price: 0,
      category: 'Proceso',
      availability: true
    },
    {
      id: '4',
      name: 'Métodos de Pago',
      description: 'Información sobre formas de pago disponibles',
      keywords: 'pago, tarjeta, transferencia, efectivo',
      price: 0,
      category: 'Pagos',
      availability: true
    },
    {
      id: '5',
      name: 'Tiempos de Entrega',
      description: 'Información sobre plazos y entregas',
      keywords: 'entrega, tiempo, cuándo, plazo',
      price: 0,
      category: 'Logística',
      availability: true
    }
  ];

  const mockSupportData = [
    {
      id: '1',
      name: 'Problemas de Acceso',
      description: 'Soluciones para problemas de login y acceso',
      keywords: 'no puedo entrar, login, contraseña, acceso',
      price: 0,
      category: 'Acceso',
      availability: true
    },
    {
      id: '2',
      name: 'Errores de Pago',
      description: 'Resolución de problemas con pagos y facturación',
      keywords: 'error pago, no funciona tarjeta, cobro',
      price: 0,
      category: 'Pagos',
      availability: true
    },
    {
      id: '3',
      name: 'Problemas Técnicos',
      description: 'Soluciones para errores técnicos comunes',
      keywords: 'error, no funciona, problema técnico, bug',
      price: 0,
      category: 'Técnico',
      availability: true
    },
    {
      id: '4',
      name: 'Cancelaciones',
      description: 'Proceso para cancelar servicios o pedidos',
      keywords: 'cancelar, anular, devolver, reembolso',
      price: 0,
      category: 'Cancelaciones',
      availability: true
    },
    {
      id: '5',
      name: 'Cambios de Plan',
      description: 'Cómo cambiar o actualizar tu plan actual',
      keywords: 'cambiar plan, upgrade, downgrade, modificar',
      price: 0,
      category: 'Planes',
      availability: true
    }
  ];

  const mockValidationErrors: ValidationError[] = [
    {
      row: 5,
      column: 'Precio',
      message: 'El campo contiene texto en vez de número'
    },
    {
      row: 12,
      column: 'Nombre del Producto',
      message: 'Campo obligatorio vacío'
    },
    {
      row: 18,
      column: 'Categoría',
      message: 'Categoría no válida. Usar: Software, Servicios, Hosting'
    }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Guardando configuración:', formData);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDatabaseState(prev => ({
        ...prev,
        [activeDatabaseTab]: {
          ...prev[activeDatabaseTab],
          isUploading: true,
          uploadProgress: 0,
          validationErrors: []
        }
      }));

      // Simulate file upload and validation
      const interval = setInterval(() => {
        setDatabaseState(prev => {
          const newProgress = prev[activeDatabaseTab].uploadProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...prev,
              [activeDatabaseTab]: {
                ...prev[activeDatabaseTab],
                isUploading: false,
                uploadProgress: 100,
                isLoaded: true,
                fileName: file.name,
                recordCount: 247,
                lastUpdated: new Date().toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }),
                validationErrors: file.name.includes('error') ? mockValidationErrors : [],
                previewData: activeDatabaseTab === 'products' ? mockPreviewData : 
                           activeDatabaseTab === 'onboarding' ? mockOnboardingData : mockSupportData
              }
            };
          }
          return {
            ...prev,
            [activeDatabaseTab]: {
              ...prev[activeDatabaseTab],
              uploadProgress: newProgress
            }
          };
        });
      }, 200);
    }
  };

  const handleDownloadTemplate = () => {
    // Simulate CSV download
    const csvContent = `Nombre del Producto,Descripción,Palabras Clave,Precio,Categoría,Disponible
Software CRM Premium,Sistema completo de gestión de clientes,"crm,gestión,clientes",299,Software,Sí
Consultoría Digital,Asesoramiento en transformación digital,"consultoría,digital",150,Servicios,Sí
Hosting Empresarial,Alojamiento web profesional,"hosting,web",49,Hosting,Sí`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_productos_servicios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefreshBot = () => {
    console.log('Refrescando chatbot...');
    // Simulate bot refresh
    setTimeout(() => {
      alert('Chatbot actualizado correctamente');
    }, 1000);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
        
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Foto de perfil</h4>
            <p className="text-sm text-gray-500">JPG, GIF o PNG. Máximo 1MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
            <div className="relative">
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Cuéntanos sobre ti..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Notificaciones</h3>
        <p className="text-sm text-gray-600 mb-6">Elige qué notificaciones quieres recibir</p>

        <div className="space-y-4">
          {[
            { key: 'newLead', label: 'Nuevo lead', description: 'Cuando se registre un nuevo lead' },
            { key: 'newMessage', label: 'Nuevo mensaje', description: 'Cuando recibas un mensaje de WhatsApp' },
            { key: 'leadStatusChange', label: 'Cambio de estado', description: 'Cuando un lead cambie de etapa' },
            { key: 'dailyReport', label: 'Reporte diario', description: 'Resumen diario de actividad' },
            { key: 'weeklyReport', label: 'Reporte semanal', description: 'Resumen semanal de métricas' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{notification.label}</h4>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications[notification.key as keyof typeof formData.notifications]}
                  onChange={(e) => handleNestedInputChange('notifications', notification.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias de la Aplicación</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
            <select
              value={formData.preferences.language}
              onChange={(e) => handleNestedInputChange('preferences', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zona horaria</label>
            <select
              value={formData.preferences.timezone}
              onChange={(e) => handleNestedInputChange('preferences', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Europe/Madrid">Madrid (GMT+1)</option>
              <option value="Europe/London">Londres (GMT+0)</option>
              <option value="America/New_York">Nueva York (GMT-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={formData.preferences.theme === 'light'}
                  onChange={(e) => handleNestedInputChange('preferences', 'theme', e.target.value)}
                  className="mr-2"
                />
                Claro
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={formData.preferences.theme === 'dark'}
                  onChange={(e) => handleNestedInputChange('preferences', 'theme', e.target.value)}
                  className="mr-2"
                />
                Oscuro
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Respuesta automática</h4>
                <p className="text-sm text-gray-600">Enviar mensaje automático cuando no estés disponible</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.autoResponse}
                  onChange={(e) => handleNestedInputChange('preferences', 'autoResponse', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Mostrar estado en línea</h4>
                <p className="text-sm text-gray-600">Otros usuarios podrán ver cuando estés conectado</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.showOnlineStatus}
                  onChange={(e) => handleNestedInputChange('preferences', 'showOnlineStatus', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Base de Datos del Chatbot</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gestiona las diferentes bases de datos que el bot utilizará para responder automáticamente
        </p>
      </div>

      {/* Database Tabs */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveDatabaseTab('products')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeDatabaseTab === 'products'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Productos/Servicios
          </button>
          <button
            onClick={() => setActiveDatabaseTab('onboarding')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeDatabaseTab === 'onboarding'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Onboarding
          </button>
          <button
            onClick={() => setActiveDatabaseTab('support')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeDatabaseTab === 'support'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Soporte Técnico
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">{renderCurrentDatabaseStatus()}</div>

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">{renderUploadSection()}</div>

      {/* Preview Data */}
      {showPreview && getCurrentPreviewData().length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">{renderPreviewData()}</div>
      )}

      {/* Validation Errors */}
      {showValidationErrors && getCurrentDatabaseState().validationErrors.length > 0 && (
        <div className="bg-white border border-red-200 rounded-xl p-6">{renderValidationErrors()}</div>
      )}
    </div>
  );

  const getCurrentDatabaseState = () => {
    return databaseState[activeDatabaseTab];
  };

  const getCurrentPreviewData = () => {
    switch (activeDatabaseTab) {
      case 'products':
        return mockPreviewData;
      case 'onboarding':
        return mockOnboardingData;
      case 'support':
        return mockSupportData;
      default:
        return mockPreviewData;
    }
  };

  const getDatabaseTitle = () => {
    switch (activeDatabaseTab) {
      case 'products':
        return 'Productos y Servicios';
      case 'onboarding':
        return 'Flujos de Onboarding';
      case 'support':
        return 'Base de Soporte Técnico';
      default:
        return 'Base de Datos';
    }
  };

  const getDatabaseDescription = () => {
    switch (activeDatabaseTab) {
      case 'products':
        return 'Información de productos y servicios para respuestas comerciales';
      case 'onboarding':
        return 'Flujos y mensajes para guiar nuevos usuarios';
      case 'support':
        return 'Soluciones y respuestas para problemas técnicos';
      default:
        return 'Base de datos del chatbot';
    }
  };

  const renderCurrentDatabaseStatus = () => {
    const currentDb = getCurrentDatabaseState();
    
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">{getDatabaseTitle()}</h4>
          {currentDb.isLoaded && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Base Cargada</span>
            </div>
          )}
        </div>

        {currentDb.isLoaded ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-800 font-medium">
                    Base cargada correctamente el {currentDb.lastUpdated}
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    {getDatabaseDescription()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Archivo</span>
                </div>
                <p className="text-gray-900 font-semibold mt-1">{currentDb.fileName}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Registros</span>
                </div>
                <p className="text-gray-900 font-semibold mt-1">{currentDb.recordCount.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Estado Bot</span>
                </div>
                <p className="text-green-600 font-semibold mt-1">Activo</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Vista Previa</span>
              </button>

              <button
                onClick={handleRefreshBot}
                className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refrescar Chatbot</span>
              </button>

              {currentDb.validationErrors.length > 0 && (
                <button
                  onClick={() => setShowValidationErrors(!showValidationErrors)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Ver Errores ({currentDb.validationErrors.length})</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Aún no has cargado tu base de {getDatabaseTitle().toLowerCase()}</p>
            <p className="text-sm text-gray-500">
              {getDatabaseDescription()}
            </p>
          </div>
        )}
      </>
    );
  };

  const renderUploadSection = () => {
    const currentDb = getCurrentDatabaseState();
    
    return (
      <>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cargar Nueva Base de Datos</h4>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Plantilla CSV</span>
            </button>

            <button
              onClick={() => alert('Mostrando estructura esperada...')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Ver Estructura Esperada</span>
            </button>
          </div>

          {currentDb.isUploading ? (
            <div className="border-2 border-dashed border-green-300 rounded-lg p-8">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-green-500 mx-auto mb-4 animate-spin" />
                <p className="text-green-700 font-medium mb-2">Procesando archivo...</p>
                <div className="w-full bg-green-100 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentDb.uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-green-600">{currentDb.uploadProgress}% completado</p>
              </div>
            </div>
          ) : (
            <div 
              onClick={handleFileUpload}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Subir Archivo CSV o Excel</p>
                <p className="text-sm text-gray-600 mb-4">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>Formatos: .csv, .xlsx</span>
                  <span>•</span>
                  <span>Máximo: 10MB</span>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          {currentDb.isLoaded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">Importante</p>
                  <p className="text-yellow-700 text-sm">
                    Para modificar tu base, sube nuevamente el archivo actualizado. 
                    Esta operación sobrescribirá los datos anteriores.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderPreviewData = () => {
    const previewData = getCurrentPreviewData();
    const currentDb = getCurrentDatabaseState();
    
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Vista Previa de Datos</h4>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Palabras Clave</th>
                {activeDatabaseTab === 'products' && (
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Precio</th>
                )}
                <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Disponible</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((record) => (
                <tr key={record.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{record.name}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{record.description}</td>
                  <td className="py-3 px-4 text-gray-600">{record.keywords}</td>
                  {activeDatabaseTab === 'products' && (
                    <td className="py-3 px-4 text-gray-900">
                      {record.price > 0 ? `€${record.price}` : 'Gratis'}
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {record.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {record.availability ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Mostrando las primeras {previewData.length} filas de {currentDb.recordCount} registros totales
        </p>
      </>
    );
  };

  const renderValidationErrors = () => {
    const currentDb = getCurrentDatabaseState();
    
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-red-900">Errores de Validación</h4>
          <button
            onClick={() => setShowValidationErrors(false)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {currentDb.validationErrors.map((error, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">
                  Fila {error.row}, Columna "{error.column}"
                </p>
                <p className="text-red-700 text-sm">{error.message}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-red-200">
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Descargar CSV de Errores</span>
          </button>
        </div>
      </>
    );
  };

  const renderAutomationTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Automatización del Chatbot</h3>
        <p className="text-gray-600">Configura las reglas y comportamientos automáticos del bot</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <h4 className="text-lg font-semibold text-gray-900">Respuestas Automáticas</h4>
          </div>
          <p className="text-gray-600 mb-4">Configura mensajes automáticos para diferentes situaciones</p>
          <button className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors">
            Configurar Respuestas
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h4 className="text-lg font-semibold text-gray-900">Triggers y Acciones</h4>
          </div>
          <p className="text-gray-600 mb-4">Define qué acciones ejecutar según palabras clave</p>
          <button className="w-full bg-yellow-50 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-100 transition-colors">
            Gestionar Triggers
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Analíticas del Chatbot</h3>
        <p className="text-gray-600">Métricas y estadísticas de rendimiento del bot</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
          <div className="text-gray-600">Tasa de Respuesta</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">2.3s</div>
          <div className="text-gray-600">Tiempo Promedio</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">1,247</div>
          <div className="text-gray-600">Consultas Resueltas</div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Seguridad</h3>
        <p className="text-sm text-gray-600 mb-6">Gestiona la seguridad de tu cuenta y del sistema</p>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Cambiar contraseña</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Actualizar contraseña
              </button>
            </div>
          </div>

          {userRole === 'admin' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Gestión de usuarios</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span>Gestionar usuarios del sistema</span>
                  <Users className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span>Configurar permisos</span>
                  <Shield className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span>Logs de actividad</span>
                  <SettingsIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'database':
        return renderDatabaseTab();
      case 'automation':
        return renderAutomationTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia y gestiona el sistema</p>
        </div>

        <div className="flex space-x-8">
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {renderActiveTab()}

              {(activeTab === 'profile' || activeTab === 'notifications' || activeTab === 'preferences') && (
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar cambios</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;