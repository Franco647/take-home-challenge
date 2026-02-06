import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, PieChart, Activity, ShieldCheck, FileWarning } from 'lucide-react';
import api from '../../services/api';
import type { Summary } from '../../types';

export default function Dashboard() {
    const navigate = useNavigate()
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
        try {
            const response = await api.get('/policies/summary');
            setSummary(response.data);
        } catch (error) {
            console.error("Error al cargar el resumen:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchSummary();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando estadísticas...</div>;
    if (!summary) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>;

    const formatMoney = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Resumen General</h1>
        <p className="text-gray-500 text-sm">Métricas consolidadas de la cartera[cite: 142].</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start text-brand-600">
            <Users size={24} />
            <span className="text-xs font-bold px-2 py-1 bg-brand-50 rounded">Total</span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Pólizas Totales [cite: 143]</p>
          <h3 className="text-3xl font-bold text-gray-900">{summary.total_policies}</h3>
        </article>

        <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start text-green-600">
            <DollarSign size={24} />
            <span className="text-xs font-bold px-2 py-1 bg-green-50 rounded">Ingresos</span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Primas Totales [cite: 144]</p>
          <h3 className="text-3xl font-bold text-gray-900">{formatMoney(summary.total_premium_usd)}</h3>
        </article>

        <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start text-blue-600">
            <ShieldCheck size={24} />
            <span className="text-xs font-bold px-2 py-1 bg-blue-50 rounded">Activo</span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Pólizas Activas [cite: 145]</p>
          <h3 className="text-3xl font-bold text-gray-900">{summary.count_by_status.active || 0}</h3>
        </article>

        <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start text-amber-600">
            <FileWarning size={24} />
            <span className="text-xs font-bold px-2 py-1 bg-amber-50 rounded">Estado</span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Canceladas / Expiradas [cite: 145]</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {(summary.count_by_status.cancelled || 0) + (summary.count_by_status.expired || 0)}
          </h3>
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-brand-500" />
            Primas por Tipo de Póliza [cite: 146]
          </h3>
          <div className="space-y-4">
            {Object.entries(summary.premium_by_type).map(([type, amount]: [string, any]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">{type}</span>
                <div className="flex items-center gap-4 flex-1 justify-end">
                  <span className="font-bold text-gray-900">{formatMoney(amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-600 p-8 rounded-xl shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
            <Activity size={120} className="absolute -right-8 -bottom-8 text-brand-500 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">Análisis de IA</h3>
            <p className="text-brand-100 mb-6">Genera reportes predictivos basados en la carga de datos actual.</p>
            <button 
                onClick={() => navigate('/policies')} 
                className="bg-white text-brand-600 px-6 py-2 rounded-lg font-bold w-fit hover:bg-brand-50 transition-colors shadow-md"
            >
                Ver Insights en Pólizas
            </button>
        </div>
      </section>
    </div>
  );
}