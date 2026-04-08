import React from 'react';
import { LayoutDashboard, History, Trash2, PlusCircle } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'trash', label: 'Papelera', icon: Trash2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Presupuestos</h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">CRM System</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              currentView === item.id
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-blue-600' : 'text-gray-400'} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setCurrentView('form')}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
        >
          <PlusCircle size={20} />
          Crear Proyecto
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
