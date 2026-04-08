import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Layout } from 'lucide-react';

const KanbanCard = ({ proj, index }) => {
  return (
    <Draggable draggableId={proj.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border rounded-xl p-4 mb-3 cursor-grab select-none transition-all duration-200 ${
            snapshot.isDragging
              ? 'shadow-2xl scale-105 rotate-1 border-blue-300 ring-2 ring-blue-200'
              : 'border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-gray-900 text-sm leading-tight">{proj.nombre_cliente}</h4>
            <span className="text-blue-600 font-extrabold text-sm whitespace-nowrap ml-2">{proj.precio_total}€</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
            <Layout size={13} />
            <span className="truncate">{proj.tipo_proyecto}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar size={13} />
            <span>Entrega: {new Date(proj.fecha_estimada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
