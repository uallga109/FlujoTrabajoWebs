import React, { useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';
import KanbanView from './KanbanView';

const ProjectListView = ({ viewType, onEdit }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Only dashboard has the Kanban toggle
  const [displayMode, setDisplayMode] = useState('list'); // 'list' | 'kanban'

  const statusMap = {
    'dashboard': 'activo',
    'history': 'completado',
    'trash': 'descartado'
  };

  const titleMap = {
    'dashboard': { title: 'Proyectos Activos', subtitle: 'Gestiona tus presupuestos en curso.' },
    'history': { title: 'Historial', subtitle: 'Proyectos que ya han sido completados.' },
    'trash': { title: 'Papelera', subtitle: 'Proyectos descartados. Se pueden restaurar o eliminar definitivamente.' }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    const estado = statusMap[viewType] || 'activo';
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('estado', estado)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching from Supabase:', error);
    } else {
      setProjectsList(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    // Reset to list view when switching tabs
    if (viewType !== 'dashboard') setDisplayMode('list');
  }, [viewType]);

  const { title, subtitle } = titleMap[viewType] || titleMap['dashboard'];

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-500">{subtitle}</p>
        </div>

        {/* View toggle — only visible on Dashboard */}
        {viewType === 'dashboard' && (
          <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setDisplayMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                displayMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={16} />
              Vista Lista
            </button>
            <button
              onClick={() => setDisplayMode('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                displayMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutGrid size={16} />
              Vista Kanban
            </button>
          </div>
        )}
      </div>

      {/* Kanban view (dashboard only) */}
      {viewType === 'dashboard' && displayMode === 'kanban' ? (
        <KanbanView />
      ) : (
        // List / Grid view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-500 font-medium animate-pulse">Cargando proyectos...</p>
            </div>
          ) : projectsList.map(proj => (
            <ProjectCard
              key={proj.id}
              proj={proj}
              fetchProjects={fetchProjects}
              onEdit={onEdit}
            />
          ))}
          {!isLoading && projectsList.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <p className="text-gray-500 font-medium text-lg">No hay proyectos en esta vista todavía.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectListView;
