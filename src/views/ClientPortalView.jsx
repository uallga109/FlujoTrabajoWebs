import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ── Mapa etapa_kanban / estado -> progreso visual ─────────
const getProgress = (proyecto) => {
  if (proyecto.estado === 'completado') {
    return {
      pct: 100,
      fase: '¡Tu web está lista y publicada! 🚀',
      color: '#22c55e',
      trackColor: '#dcfce7',
      badge: 'bg-green-100 text-green-700',
      badgeLabel: 'Completado',
    };
  }
  const map = {
    pendiente: {
      pct: 25,
      fase: 'Fase 1: Esperando tu material (Textos / Fotos)',
      color: '#f59e0b',
      trackColor: '#fef3c7',
      badge: 'bg-yellow-100 text-yellow-700',
      badgeLabel: 'Pendiente de material',
    },
    desarrollo: {
      pct: 60,
      fase: 'Fase 2: Estamos programando tu web 👨‍💻',
      color: '#3b82f6',
      trackColor: '#dbeafe',
      badge: 'bg-blue-100 text-blue-700',
      badgeLabel: 'En desarrollo',
    },
    revision: {
      pct: 90,
      fase: 'Fase 3: Últimos retoques y revisión 🔍',
      color: '#8b5cf6',
      trackColor: '#ede9fe',
      badge: 'bg-purple-100 text-purple-700',
      badgeLabel: 'En revisión',
    },
  };
  return map[proyecto.etapa_kanban] || map['pendiente'];
};

// ── Circular Progress SVG ─────────────────────────────────
const CircularProgress = ({ pct, color, trackColor }) => {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        {/* Track */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      {/* Percentage label */}
      <span
        className="absolute text-3xl font-extrabold"
        style={{ color }}
      >
        {pct}%
      </span>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
const ClientPortalView = () => {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProyecto(data);
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Cargando tu proyecto...</p>
        </div>
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Proyecto no encontrado</h1>
          <p className="text-gray-500">
            Este enlace no corresponde a ningún proyecto activo. 
            Por favor, contacta con tu agencia para obtener el enlace correcto.
          </p>
        </div>
      </div>
    );
  }

  const progress = getProgress(proyecto);
  const fechaEntrega = proyecto.fecha_estimada
    ? new Date(proyecto.fecha_estimada).toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'Por definir';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/40 flex items-start justify-center p-6 pt-16">
      <div className="w-full max-w-xl">
        {/* Branding Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 bg-white border border-gray-200 px-4 py-1.5 rounded-full mb-6">
            Portal del Cliente
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hola, {proyecto.nombre_cliente.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-lg">Aquí puedes ver el estado actualizado de tu proyecto en tiempo real.</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            <CircularProgress pct={progress.pct} color={progress.color} trackColor={progress.trackColor} />
            
            <span className={`mt-6 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${progress.badge}`}>
              {progress.badgeLabel}
            </span>

            <h2 className="mt-4 text-xl font-bold text-gray-900 px-4 leading-snug">
              {progress.fase}
            </h2>

            {/* Progress Steps */}
            <div className="w-full mt-8 flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-gray-200">
                <div
                  className="h-full transition-all duration-700 rounded-full"
                  style={{ width: `${progress.pct}%`, backgroundColor: progress.color }}
                />
              </div>
              {[
                { label: 'Material', active: progress.pct >= 25 },
                { label: 'Desarrollo', active: progress.pct >= 60 },
                { label: 'Revisión', active: progress.pct >= 90 },
                { label: '¡Publicado!', active: progress.pct >= 100 },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center z-10">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                      step.active
                        ? 'text-white border-transparent'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    style={step.active ? { backgroundColor: progress.color, borderColor: progress.color } : {}}
                  >
                    {step.active ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-semibold ${step.active ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Detalles del Proyecto</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
              <span className="text-gray-500 text-sm">Tipo de web</span>
              <span className="font-semibold text-gray-900 text-sm">{proyecto.tipo_proyecto}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
              <span className="text-gray-500 text-sm">Inversión</span>
              <span className="font-extrabold text-blue-600 text-lg">{proyecto.precio_total}€</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Fecha estimada de entrega</span>
              <span className="font-semibold text-gray-900 text-sm text-right max-w-[200px]">{fechaEntrega}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-10">
          ¿Tienes dudas? Escríbenos por WhatsApp al número habitual.
        </p>
      </div>
    </div>
  );
};

export default ClientPortalView;
