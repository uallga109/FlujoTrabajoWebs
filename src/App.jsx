import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ProjectListView from './views/ProjectListView';
import CreateProjectView from './views/CreateProjectView';
import EditModal from './components/EditModal';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchProjectsCallback = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="ml-64 flex-1 p-8">
        {showSuccess && (
          <div className="fixed top-6 right-6 z-50 bg-green-50 text-green-800 border border-green-200 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle size={24} className="text-green-600" />
            <strong className="font-semibold text-lg">¡Operación realizada con éxito!</strong>
          </div>
        )}

        {['dashboard', 'history', 'trash'].includes(currentView) && (
          <ProjectListView 
            key={`${currentView}-${refreshKey}`}
            viewType={currentView} 
            onEdit={(proj) => setEditingProject(proj)}
          />
        )}

        {currentView === 'form' && (
          <CreateProjectView 
            setCurrentView={setCurrentView} 
            setShowSuccess={setShowSuccess} 
          />
        )}
      </main>

      {editingProject && (
        <EditModal 
          project={editingProject} 
          onClose={() => setEditingProject(null)} 
          fetchProjects={fetchProjectsCallback}
        />
      )}
    </div>
  );
}

export default App;
