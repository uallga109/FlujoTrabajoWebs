import React, { useState } from 'react';
import { Calendar, Layout, Trash2, CheckCircle, RefreshCw, PenSquare, Trash, Link, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { calculateDaysPassed } from '../lib/dateUtils';

const ProjectCard = ({ proj, fetchProjects, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const daysOpen = calculateDaysPassed(proj.created_at);
  const isStagnant = proj.estado === 'activo' && daysOpen > 30;

  const updateStatus = async (newStatus) => {
    const { error } = await supabase
      .from('proyectos')
      .update({ estado: newStatus })
      .eq('id', proj.id);
    
    if (!error) {
      if (newStatus === 'completado') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999
        });
      }
      fetchProjects();
    }
  };
// ... rest of the component

  const deleteProject = async () => {
    if (window.confirm("¿Estás seguro de eliminar físicamente este proyecto? No hay vuelta atrás.")) {
      const { error } = await supabase.from('proyectos').delete().eq('id', proj.id);
      if (!error) fetchProjects();
    }
  };

  const copyClientLink = () => {
    const url = `${window.location.origin}/portal/${proj.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative ${isStagnant ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
      {/* Copy link toast */}
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap shadow-lg animate-bounce">
          ✅ ¡Enlace copiado!
        </div>
      )}

      <div className={`flex justify-between items-start mb-4 pb-4 border-b border-dashed ${isStagnant ? 'border-red-200' : 'border-gray-100'}`}>
        <div>
          <h3 className="text-xl font-bold text-gray-900 m-0 flex items-center gap-2">
            {proj.nombre_cliente}
            {isStagnant && <Flame size={20} className="text-red-500 animate-pulse" />}
          </h3>
          <span className={`font-extrabold text-lg block mt-1 ${isStagnant ? 'text-red-700' : 'text-blue-600'}`}>{proj.precio_total}€</span>
          {isStagnant && (
            <span className="inline-block mt-2 text-[11px] font-bold text-red-600 uppercase tracking-widest bg-red-100 px-2 py-1 rounded-lg">
              ⚠️ ¡Lleva {daysOpen} días estancado!
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {proj.estado === 'activo' && (
            <>
              <button onClick={() => onEdit(proj)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                <PenSquare size={18} />
              </button>
              <button onClick={() => updateStatus('completado')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Completar">
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
              <button onClick={() => updateStatus('activo')} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Restaurar">
                <RefreshCw size={18} />
              </button>
              <button onClick={deleteProject} className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors" title="Eliminar definitivamente">
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

      {/* Copy client link button */}
      <button
        onClick={copyClientLink}
        className="mt-5 w-full flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 border border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl py-2.5 transition-all"
      >
        <Link size={14} />
        Copiar Enlace del Cliente
      </button>
    </div>
  );
};

export default ProjectCard;
