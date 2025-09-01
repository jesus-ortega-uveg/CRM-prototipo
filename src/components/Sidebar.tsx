import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  Settings, 
  LogOut, 
  ChevronDown,
  User
} from 'lucide-react';
import type { ActiveView, UserRole } from '../App';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, userRole }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const menuItems = [
    { 
      id: 'dashboard' as ActiveView, 
      label: 'Dashboard', 
      icon: BarChart3,
      badge: null
    },
    { 
      id: 'leads' as ActiveView, 
      label: 'Leads', 
      icon: Users,
      badge: 12
    },
    { 
      id: 'chats' as ActiveView, 
      label: 'Chats', 
      icon: MessageCircle,
      badge: 3
    },
    { 
      id: 'settings' as ActiveView, 
      label: 'Configuración', 
      icon: Settings,
      badge: null
    }
  ];

  const handleLogout = () => {
    // Lógica de logout
    console.log('Cerrando sesión...');
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">WhatsApp CRM</h1>
            <p className="text-sm text-gray-500">Gestión de Leads</p>
          </div>
        </div>

        {/* User Info */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Juan Pérez</p>
              <p className="text-sm text-gray-500 capitalize">{userRole === 'admin' ? 'Administrador' : 'Usuario'}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onViewChange('settings');
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Configuración</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 border-t border-gray-100"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-green-50 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="font-medium">{item.label}</span>
                
                {item.badge && item.badge > 0 && (
                  <div className="ml-auto">
                    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;