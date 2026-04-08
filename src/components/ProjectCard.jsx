import React from 'react';
import { Calendar, Layout, Trash2, CheckCircle, RefreshCw, PenSquare, Trash } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ProjectCard = ({ proj, fetchProjects, onEdit }) => {
  const updateStatus = async (newStatus) => {
    const { error } = await supabase
      .from('proyectos')
      .update({ estado: newStatus })
      .eq('id', proj.id);
      
    if (!error) fetchProjects();
  };

  const deleteProject = async () => {
    if (window.confirm("¿Estás seguro de eliminar físicamente este proyecto? no hay vuelta atrás.")) {
      const { error } = await supabase
        .from('proyectos')
        .delete()
        .eq('id', proj.id);
      if (!error) fetchProjects();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100 border-dashed">
        <div>
          <h3 className="text-xl font-bold text-gray-900 m-0">{proj.nombre_cliente}</h3>
          <span className="text-blue-600 font-extrabold text-lg block mt-1">{proj.precio_total}€</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {proj.estado === 'activo' && (
            <>
              <button onClick={() => onEdit(proj)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                <PenSquare size={18} />
              </button>
              <button onClick={() => updateStatus('completado')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Marcar como Completado">
                <CheckCircle size={18} />
              </button>
              <button onClick={() => updateStatus('descartado')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Descartar">
                <Trash2 size={18} />
              </button>
            </>
          )}
          {proj.estado === 'completado' && (
            <button onClick={() => updateStatus('activo')} className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Reabrir">
              <RefreshCw size={18} />
            </button>
          )}
          {proj.estado === 'descartado' && (
            <>
              <button onClick={() => updateStatus('activo')} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Restaurar a Activo">
                <RefreshCw size={18} />
              </button>
              <button onClick={deleteProject} className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors" title="Eliminar Definitivamente">
                <Trash size={18} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Layout size={16} />
          <span><strong>Tipo:</strong> {proj.tipo_proyecto}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={16} />
          <span><strong>Creación:</strong> {new Date(proj.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={16} />
          <span><strong>Entrega est.:</strong> {new Date(proj.fecha_estimada).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
