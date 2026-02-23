import { useEffect, useState } from 'react';
import { 
  Ticket, 
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface MetricsSectionProps {
  metrics: {
    totalTickets: number;
    ticketsVendidos: number;
    ticketsDisponibles: number;
  };
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const [animatedMetrics, setAnimatedMetrics] = useState({
    ticketsVendidos: 0,
    ticketsDisponibles: 0,
  });

  // Animación de números
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedMetrics({
        ticketsVendidos: Math.round(metrics.ticketsVendidos * easeOut),
        ticketsDisponibles: Math.round(metrics.ticketsDisponibles * easeOut),
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedMetrics({
          ticketsVendidos: metrics.ticketsVendidos,
          ticketsDisponibles: metrics.ticketsDisponibles,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [metrics]);

  const pieData = [
    { name: 'Vendidos', value: metrics.ticketsVendidos, color: '#f59e0b' },
    { name: 'Disponibles', value: metrics.ticketsDisponibles, color: '#10b981' },
  ];

  const statCards = [
    {
      title: 'Tickets Vendidos',
      value: animatedMetrics.ticketsVendidos,
      total: metrics.totalTickets,
      icon: Ticket,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
    },
    {
      title: 'Tickets Disponibles',
      value: animatedMetrics.ticketsDisponibles,
      total: metrics.totalTickets,
      icon: BarChart3,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-400',
    },
  ];

  return (
    <section id="metricas" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 rounded-full px-4 py-2 mb-4">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Estadísticas en Tiempo Real</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Métricas de la Rifa
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sigue el progreso de nuestra rifa en tiempo real.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden group hover:border-white/20 transition-all"
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.total && (
                    <span className="text-gray-500 text-sm">
                      de {stat.total.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                
                {stat.total && typeof stat.value === 'number' && (
                  <div className="mt-3">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${(stat.value / stat.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {((stat.value / stat.total) * 100).toFixed(1)}% completado
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2 justify-center">
              <Ticket className="w-5 h-5 text-amber-400" />
              Distribución de Tickets
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-400 text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-400" />
              Progreso de Venta de Tickets
            </h3>
            <span className="text-amber-400 font-bold">
              {((metrics.ticketsVendidos / metrics.totalTickets) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-full transition-all duration-1000 relative"
              style={{ width: `${(metrics.ticketsVendidos / metrics.totalTickets) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>0 tickets</span>
            <span>{metrics.ticketsVendidos.toLocaleString()} vendidos</span>
            <span>{metrics.totalTickets.toLocaleString()} total</span>
          </div>
        </div>
      </div>
    </section>
  );
}
