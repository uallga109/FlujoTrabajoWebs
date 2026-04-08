import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EditModal = ({ project, onClose, fetchProjects }) => {
  const [clientName, setClientName] = useState('');
  const [price, setPrice] = useState(0);
  const [estimatedDate, setEstimatedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setClientName(project.nombre_cliente);
      setPrice(project.precio_total);
      setEstimatedDate(project.fecha_estimada);
    }
  }, [project]);

  if (!project) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase
      .from('proyectos')
      .update({
        nombre_cliente: clientName,
        precio_total: price,
        fecha_estimada: estimatedDate
      })
      .eq('id', project.id);
      
    setIsLoading(false);
    if (!error) {
      fetchProjects();
      onClose();
    } else {
      alert("Error al actualizar el proyecto");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Editar Proyecto</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Cliente</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={e => setClientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Total (€)</label>
            <input 
              type="number" 
              value={price} 
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Estimada de Entrega</label>
            <input 
              type="date" 
              value={estimatedDate} 
              onChange={e => setEstimatedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900" 
              required
            />
          </div>
          
          <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
