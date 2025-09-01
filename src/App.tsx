import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Chats from './components/Chats';
import Settings from './components/Settings';

export type UserRole = 'admin' | 'standard';
export type ActiveView = 'dashboard' | 'leads' | 'chats' | 'settings';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [userRole] = useState<UserRole>('admin'); // En producción esto vendría del auth

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard userRole={userRole} />;
      case 'leads':
        return <Leads userRole={userRole} />;
      case 'chats':
        return <Chats userRole={userRole} />;
      case 'settings':
        return <Settings userRole={userRole} />;
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        userRole={userRole}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full transition-all duration-300 ease-in-out">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}

export default App;