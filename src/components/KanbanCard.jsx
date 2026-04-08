import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Layout, Flame } from 'lucide-react';
import { calculateDaysPassed } from '../lib/dateUtils';

const KanbanCard = ({ proj, index }) => {
  const daysOpen = calculateDaysPassed(proj.created_at);
  const isStagnant = daysOpen > 30;

  return (
    <Draggable draggableId={proj.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`border rounded-xl p-4 mb-3 cursor-grab select-none transition-all duration-200 ${
            snapshot.isDragging
              ? 'shadow-2xl scale-105 rotate-1 border-blue-300 ring-2 ring-blue-200 bg-white'
              : isStagnant 
                ? 'bg-red-50 border-red-200 shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-gray-900 text-sm leading-tight flex items-center gap-1.5">
                {proj.nombre_cliente}
                {isStagnant && <Flame size={14} className="text-red-500 animate-pulse" />}
              </h4>
              {isStagnant && (
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-100 px-1.5 py-0.5 rounded w-fit">
                  ¡Lleva {daysOpen} días estancado!
                </span>
              )}
            </div>
            <span className={`font-extrabold text-sm whitespace-nowrap ml-2 ${isStagnant ? 'text-red-700' : 'text-blue-600'}`}>
              {proj.precio_total}€
            </span>
          </div>

          <div className={`flex items-center gap-1.5 text-xs mb-2 ${isStagnant ? 'text-red-400' : 'text-gray-400'}`}>
            <Layout size={13} />
            <span className="truncate">{proj.tipo_proyecto}</span>
          </div>

          <div className={`flex items-center gap-1.5 text-xs ${isStagnant ? 'text-red-400' : 'text-gray-400'}`}>
            <Calendar size={13} />
            <span>Entrega: {new Date(proj.fecha_estimada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
