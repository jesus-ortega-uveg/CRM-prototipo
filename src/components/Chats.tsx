import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, MoreVertical, Paperclip, Smile, Send, User, Star, Archive, MessageCircle, Clock, Check, CheckCheck, Plus, Bot, NutOff as BotOff, StickyNote, Eye, UserCheck, AlertCircle, Mic, Image, FileText, Calendar, CheckSquare, ArrowLeft, Filter, Zap, Brain, Pin, PinOff, Volume2, Settings, Users, Tag, Building2, ChevronDown, X, Edit3, Save } from 'lucide-react';
import type { UserRole } from '../App';

interface ChatsProps {
  userRole: UserRole;
}

interface Chat {
  id: string;
  leadId: string;
  name: string;
  company?: string;
  interest: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'active' | 'pending' | 'archived';
  leadPhase: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  avatar?: string;
  isOnline: boolean;
  assignedTo: string;
  messageStatus: 'sent' | 'delivered' | 'read';
  botActive: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'client' | 'agent' | 'bot' | 'ai';
  status: 'sent' | 'delivered' | 'read';
  isPinned?: boolean;
  isImportant?: boolean;
  attachments?: Array<{
    type: 'image' | 'file' | 'voice';
    url: string;
    name: string;
  }>;
}

interface InternalNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface AIPrompt {
  id: string;
  name: string;
  template: string;
  category: 'sales' | 'support' | 'followup' | 'closing';
}

const Chats: React.FC<ChatsProps> = ({ userRole }) => {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'archived'>('all');
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [botActive, setBotActive] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [editingPhase, setEditingPhase] = useState(false);
  const [newPhase, setNewPhase] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockChats: Chat[] = [
    {
      id: '1',
      leadId: 'lead-1',
      name: 'María González',
      company: 'Tech Solutions SA',
      interest: 'Software de gestión empresarial',
      lastMessage: 'Me interesa conocer más sobre la implementación',
      timestamp: '12:34',
      unread: 2,
      status: 'active',
      leadPhase: 'Interesado',
      priority: 'high',
      tags: ['Premium', 'Empresa'],
      isOnline: true,
      assignedTo: 'Juan Pérez',
      messageStatus: 'read',
      botActive: true
    },
    {
      id: '2',
      leadId: 'lead-2',
      name: 'Carlos Ruiz',
      company: 'Startup Innovadora',
      interest: 'Consultoría tecnológica',
      lastMessage: '¿Cuáles son los precios del servicio premium?',
      timestamp: '11:45',
      unread: 0,
      status: 'pending',
      leadPhase: 'Propuesta',
      priority: 'medium',
      tags: ['Startup', 'Consultoría'],
      isOnline: false,
      assignedTo: 'Ana López',
      messageStatus: 'delivered',
      botActive: false
    },
    {
      id: '3',
      leadId: 'lead-3',
      name: 'Ana López',
      company: 'Retail Express',
      interest: 'Sistema de inventarios',
      lastMessage: 'Perfecto, quedamos entonces para la demo mañana',
      timestamp: '10:20',
      unread: 1,
      status: 'active',
      leadPhase: 'Demo Programada',
      priority: 'high',
      tags: ['Demo', 'Retail'],
      isOnline: true,
      assignedTo: 'María García',
      messageStatus: 'read',
      botActive: true
    },
    {
      id: '4',
      leadId: 'lead-4',
      name: 'Pedro Sánchez',
      company: 'Logística Global',
      interest: 'Automatización de procesos',
      lastMessage: 'Gracias por la información detallada',
      timestamp: 'Ayer',
      unread: 0,
      status: 'archived',
      leadPhase: 'Cerrado - Ganado',
      priority: 'low',
      tags: ['Cerrado', 'Logística'],
      isOnline: false,
      assignedTo: 'Carlos Mendez',
      messageStatus: 'sent',
      botActive: false
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      text: 'Hola, buenos días. Me interesa conocer más sobre sus servicios de software empresarial.',
      timestamp: '12:30',
      sender: 'client',
      status: 'read'
    },
    {
      id: '2',
      text: '¡Hola María! Gracias por contactarnos. Me da mucho gusto saber de tu interés en nuestras soluciones.',
      timestamp: '12:32',
      sender: 'agent',
      status: 'read'
    },
    {
      id: '3',
      text: 'Te envío información detallada sobre nuestro software de gestión empresarial que se adapta perfectamente a empresas como Tech Solutions.',
      timestamp: '12:33',
      sender: 'bot',
      status: 'delivered',
      isPinned: true
    },
    {
      id: '4',
      text: 'Perfecto, me parece muy interesante. ¿Podrían agendar una demo para esta semana?',
      timestamp: '12:34',
      sender: 'client',
      status: 'read',
      isImportant: true
    },
    {
      id: '5',
      text: 'Por supuesto, María. Te propongo el jueves a las 15:00 para hacer una demo personalizada.',
      timestamp: '12:35',
      sender: 'ai',
      status: 'read'
    }
  ];

  const mockNotes: InternalNote[] = [
    {
      id: '1',
      text: 'Cliente muy interesado, empresa mediana con potencial de crecimiento',
      author: 'Juan Pérez',
      timestamp: '12:25'
    },
    {
      id: '2',
      text: 'Revisar presupuesto antes de la demo, mencionó limitaciones',
      author: 'Ana López',
      timestamp: '11:45'
    }
  ];

  const aiPrompts: AIPrompt[] = [
    {
      id: '1',
      name: 'Saludo inicial personalizado',
      template: 'Hola {nombre}, gracias por tu interés en {producto}. Me da mucho gusto poder ayudarte.',
      category: 'sales'
    },
    {
      id: '2',
      name: 'Seguimiento post-demo',
      template: 'Hola {nombre}, espero que la demo de ayer haya sido útil. ¿Tienes alguna pregunta sobre {producto}?',
      category: 'followup'
    },
    {
      id: '3',
      name: 'Propuesta comercial',
      template: 'Basado en nuestras conversaciones, he preparado una propuesta personalizada para {empresa}.',
      category: 'closing'
    },
    {
      id: '4',
      name: 'Soporte técnico',
      template: 'Hola {nombre}, he revisado tu consulta sobre {tema}. Te ayudo a resolverlo paso a paso.',
      category: 'support'
    }
  ];

  const phases = ['Nuevo', 'Contactado', 'Interesado', 'Propuesta', 'Demo Programada', 'Negociación', 'Cerrado - Ganado', 'Cerrado - Perdido'];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);
  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.interest.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || chat.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      'Nuevo': 'bg-blue-100 text-blue-700',
      'Contactado': 'bg-purple-100 text-purple-700',
      'Interesado': 'bg-green-100 text-green-700',
      'Propuesta': 'bg-orange-100 text-orange-700',
      'Demo Programada': 'bg-indigo-100 text-indigo-700',
      'Negociación': 'bg-yellow-100 text-yellow-700',
      'Cerrado - Ganado': 'bg-emerald-100 text-emerald-700',
      'Cerrado - Perdido': 'bg-red-100 text-red-700'
    };
    return colors[phase as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'client': return 'bg-gray-100 text-gray-900';
      case 'agent': return 'bg-green-500 text-white';
      case 'bot': return 'bg-blue-500 text-white';
      case 'ai': return 'bg-purple-500 text-white';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const getSenderLabel = (sender: string) => {
    switch (sender) {
      case 'client': return 'Cliente';
      case 'agent': return 'Agente';
      case 'bot': return 'Bot';
      case 'ai': return 'IA';
      default: return 'Sistema';
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Enviando mensaje:', message);
      setMessage('');
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePromptSelect = (prompt: AIPrompt) => {
    setMessage(prompt.template);
    setShowPrompts(false);
  };

  const handleAISuggest = () => {
    const suggestions = [
      'Gracias por tu interés. ¿Te gustaría agendar una llamada para conocer mejor tus necesidades?',
      'Perfecto, te envío la información que solicitas. ¿Hay algo específico que te gustaría saber?',
      'Entiendo tu consulta. Permíteme preparar una propuesta personalizada para tu empresa.'
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setMessage(randomSuggestion);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log('Agregando nota:', newNote);
      setNewNote('');
    }
  };

  const handlePhaseChange = (newPhaseValue: string) => {
    console.log('Cambiando fase a:', newPhaseValue);
    setNewPhase(newPhaseValue);
    setEditingPhase(false);
  };

  const toggleBot = () => {
    setBotActive(!botActive);
    console.log('Bot', botActive ? 'desactivado' : 'activado');
  };

  const handlePinMessage = (messageId: string) => {
    console.log('Fijando mensaje:', messageId);
  };

  const handleMarkImportant = (messageId: string) => {
    console.log('Marcando como importante:', messageId);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  const emojis = ['😊', '👍', '❤️', '😂', '😢', '😮', '😡', '🎉'];

  return (
    <div className="h-full flex bg-white">
      {/* Chat List Panel */}
      <div className={`${isMobile ? (showChatList ? 'w-full' : 'hidden') : 'w-96'} border-r border-gray-200 flex flex-col bg-gray-50`}>
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
            <button
              onClick={() => console.log('Nuevo chat')}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              title="Nuevo Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'active', label: 'Activos' },
              { key: 'pending', label: 'Pendientes' },
              { key: 'archived', label: 'Archivados' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`flex items-start p-4 hover:bg-white cursor-pointer border-b border-gray-100 transition-colors ${
                selectedChat === chat.id ? 'bg-white border-r-2 border-r-green-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                {chat.botActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                    <Bot className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(chat.priority)}`}>
                      {chat.priority.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    {getMessageStatusIcon(chat.messageStatus)}
                  </div>
                </div>
                
                {chat.company && (
                  <div className="flex items-center space-x-1 mb-1">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate">{chat.company}</span>
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-2 truncate">{chat.interest}</p>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                      {chat.unread}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPhaseColor(chat.leadPhase)}`}>
                    {chat.leadPhase}
                  </span>
                  <div className="flex space-x-1">
                    {chat.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChatData ? (
        <div className={`${isMobile ? (showChatList ? 'hidden' : 'w-full') : 'flex-1'} flex flex-col`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-100 rounded-full mr-2"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                {selectedChatData.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="font-medium text-gray-900">{selectedChatData.name}</h2>
                  {selectedChatData.company && (
                    <span className="text-sm text-gray-500">• {selectedChatData.company}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">
                    {selectedChatData.isOnline ? 'En línea' : 'Desconectado'}
                  </p>
                  <span className="text-gray-300">•</span>
                  {editingPhase ? (
                    <select
                      value={newPhase || selectedChatData.leadPhase}
                      onChange={(e) => handlePhaseChange(e.target.value)}
                      onBlur={() => setEditingPhase(false)}
                      className="text-sm bg-transparent border-none focus:ring-0 p-0"
                      autoFocus
                    >
                      {phases.map(phase => (
                        <option key={phase} value={phase}>{phase}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingPhase(true)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getPhaseColor(selectedChatData.leadPhase)} hover:opacity-80`}
                    >
                      {selectedChatData.leadPhase}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleBot}
                className={`p-2 rounded-full transition-colors ${
                  botActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={botActive ? 'Desactivar Bot' : 'Activar Bot'}
              >
                {botActive ? <Bot className="w-5 h-5" /> : <BotOff className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Notas Internas"
              >
                <StickyNote className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={() => setShowLeadDetail(!showLeadDetail)}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Ver Lead"
              >
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Bot Status Banner */}
          {!botActive && (
            <div className="bg-orange-50 border-b border-orange-200 px-4 py-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">Intervención Humana Activa</span>
                <span className="text-xs text-orange-600">• Bot desactivado por Juan Pérez a las 12:30</span>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")` 
          }}>
            {/* Pinned Messages */}
            {mockMessages.filter(msg => msg.isPinned).length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Pin className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Mensajes Fijados</span>
                </div>
                {mockMessages.filter(msg => msg.isPinned).map((msg) => (
                  <div key={msg.id} className="text-sm text-yellow-700 mb-1 last:mb-0">
                    "{msg.text}"
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}>
                  <div className="group relative max-w-xs lg:max-w-md">
                    <div className={`px-4 py-2 rounded-lg ${getSenderColor(msg.sender)} ${
                      msg.isImportant ? 'ring-2 ring-red-300' : ''
                    }`}>
                      {msg.sender !== 'client' && (
                        <div className="text-xs opacity-75 mb-1">
                          {getSenderLabel(msg.sender)}
                        </div>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        msg.sender === 'client' ? 'text-gray-500' : 'text-white text-opacity-75'
                      }`}>
                        <span className="text-xs">{msg.timestamp}</span>
                        {msg.sender !== 'client' && getMessageStatusIcon(msg.status)}
                      </div>
                    </div>
                    
                    {/* Message Actions */}
                    <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => handlePinMessage(msg.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title={msg.isPinned ? 'Desfijar' : 'Fijar mensaje'}
                        >
                          {msg.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleMarkImportant(msg.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Marcar como importante"
                        >
                          <Star className={`w-3 h-3 ${msg.isImportant ? 'text-yellow-500 fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            {/* Quick Actions Toolbar */}
            <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-100">
              <button
                onClick={handleFileUpload}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Adjuntar archivo"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Agregar nota interna"
              >
                <StickyNote className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => console.log('Crear tarea')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Crear tarea"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => console.log('Programar recordatorio')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Programar recordatorio"
              >
                <Calendar className="w-4 h-4" />
              </button>
              
              <div className="flex-1"></div>
              
              <button
                onClick={() => setShowPrompts(!showPrompts)}
                className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                title="Insertar Prompt"
              >
                <Zap className="w-4 h-4 inline mr-1" />
                Prompts
              </button>
              
              <button
                onClick={handleAISuggest}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                title="IA Sugerir Respuesta"
              >
                <Brain className="w-4 h-4 inline mr-1" />
                IA
              </button>
            </div>

            {/* Message Input Area */}
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
                    <div className="grid grid-cols-4 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setMessage(message + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="p-2 hover:bg-gray-100 rounded text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-3 rounded-lg transition-colors ${
                  message.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => console.log('Archivo seleccionado:', e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una conversación</h3>
            <p className="text-gray-500">Elige un chat de la lista para comenzar a conversar</p>
          </div>
        </div>
      )}

      {/* Prompts Sidebar */}
      {showPrompts && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Prompts IA</h3>
              <button
                onClick={() => setShowPrompts(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {aiPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => handlePromptSelect(prompt)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{prompt.name}</h4>
                    <span className="text-xs text-gray-500 capitalize">{prompt.category}</span>
                  </div>
                  <p className="text-sm text-gray-600">{prompt.template}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes Sidebar */}
      {showNotes && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Notas Internas</h3>
              <button
                onClick={() => setShowNotes(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3 mb-4">
              {mockNotes.map((note) => (
                <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-900 mb-2">{note.text}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{note.author}</span>
                    <span>{note.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Agregar nota interna..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className={`w-full mt-2 px-4 py-2 rounded-lg transition-colors ${
                  newNote.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Agregar Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Sidebar */}
      {showLeadDetail && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Detalle del Lead</h3>
              <button
                onClick={() => setShowLeadDetail(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {selectedChatData && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">{selectedChatData.name}</h4>
                  {selectedChatData.company && (
                    <p className="text-sm text-gray-600">{selectedChatData.company}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Interés Principal</label>
                    <p className="text-sm text-gray-900">{selectedChatData.interest}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fase Actual</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPhaseColor(selectedChatData.leadPhase)}`}>
                      {selectedChatData.leadPhase}
                    </span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Prioridad</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedChatData.priority)}`}>
                      {selectedChatData.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Responsable</label>
                    <p className="text-sm text-gray-900">{selectedChatData.assignedTo}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Etiquetas</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedChatData.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Editar Lead
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;