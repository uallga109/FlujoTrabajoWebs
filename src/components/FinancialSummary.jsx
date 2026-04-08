import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Wallet, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FinancialSummary = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ cobrado: 0, pipeline: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      setIsLoading(true);
      const { data: projects, error } = await supabase
        .from('proyectos')
        .select('precio_total, estado');

      if (error) {
        console.error('Error fetching financial data:', error);
      } else {
        let cobrado = 0;
        let pipeline = 0;

        projects?.forEach(p => {
          const precio = parseFloat(p.precio_total) || 0;
          if (p.estado === 'completado') {
            cobrado += precio;
          } else if (p.estado !== 'descartado') {
            pipeline += precio;
          }
        });

        setTotals({ cobrado, pipeline });
        setData([
          { name: 'Dinero Cobrado', value: cobrado, color: '#10b981' }, // Emerald-500
          { name: 'Dinero en Pipeline', value: pipeline, color: '#3b82f6' } // Blue-500
        ]);
      }
      setIsLoading(false);
    };

    fetchFinancialData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-pulse">
        <div className="h-48 bg-gray-50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-8">
      {/* Chart Section */}
      <div className="w-full md:w-1/3 h-[180px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${value.toLocaleString()}€`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total</span>
          <span className="text-xl font-bold text-gray-900">{(totals.cobrado + totals.pipeline).toLocaleString()}€</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700">Dinero Cobrado</p>
            <h3 className="text-2xl font-bold text-gray-900">{totals.cobrado.toLocaleString()}€</h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700">Pipeline Actual</p>
            <h3 className="text-2xl font-bold text-gray-900">💰 {totals.pipeline.toLocaleString()}€</h3>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center border-l border-gray-100 pl-8 h-24">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <Clock size={16} />
          <span>Salud Financiera</span>
        </div>
        <p className="text-xs text-gray-400 max-w-[150px]">
          Basado en proyectos activos vs. completados de toda la historia.
        </p>
      </div>
    </div>
  );
};

export default FinancialSummary;
