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
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg dark:shadow-2xl border border-gray-100 dark:border-white/5 mb-8 animate-pulse">
        <div className="h-48 bg-gray-50 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg dark:shadow-2xl border border-gray-100 dark:border-white/5 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
      <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
      
      {/* Chart Section */}
      <div className="w-full md:w-1/3 h-[180px] relative z-10">
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
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', backgroundColor: '#1e293b', color: '#fff' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value) => [`${value.toLocaleString()}€`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Total</span>
          <span className="text-xl font-black text-gray-900 dark:text-white">{(totals.cobrado + totals.pipeline).toLocaleString()}€</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full z-10">
        <div className="p-5 rounded-2xl bg-green-50/50 dark:bg-emerald-500/5 border border-green-100 dark:border-emerald-500/10 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/30">
            <Wallet size={26} />
          </div>
          <div>
            <p className="text-sm font-bold text-green-700 dark:text-emerald-400 mb-0.5">Dinero Cobrado</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{totals.cobrado.toLocaleString()}€</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
            <TrendingUp size={26} />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-0.5">Pipeline Actual</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{totals.pipeline.toLocaleString()}€</h3>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center border-l border-gray-100 dark:border-white/5 pl-8 h-24 z-10">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1.5 font-bold">
          <Clock size={16} />
          <span>Salud Financiera</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[150px] font-medium leading-relaxed">
          Basado en proyectos activos vs. completados.
        </p>
      </div>
    </div>
  );
};

export default FinancialSummary;
