import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import clsx from 'clsx';
import type { PoliciesResponse, Policy } from '../../types';

export default function PoliciesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const page = parseInt(searchParams.get('page') || '1');
    const q = searchParams.get('q') || '';

    const [aiLoading, setAiLoading] = useState(false);
    const [aiData, setAiData] = useState<any>(null);
    const [showAiModal, setShowAiModal] = useState(false);

    const fetchPolicies = useCallback(async () => {
        setLoading(true);
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            
            const { data } = await api.get<PoliciesResponse>(`/policies?limit=${limit}&offset=${offset}&q=${q}`);

            if (data) {
                setPolicies(data.items || []);
                setTotal(data.pagination?.total || 0);
            }
        } catch (err) {
            console.error("Error cargando pólizas:", err);
            toast.error("Error al cargar pólizas");
        } finally {
            setLoading(false);
        }
    }, [page, q]);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    const handleSearch = (val: string) => {
        setSearchParams({ q: val, page: '1' });
    };

    const handleGenerateInsights = async () => {
        setAiLoading(true);
        setShowAiModal(true);
        try {
            const { data } = await api.post<any>('/ai/insights', { filters: { q } });

            if (data) {
                setAiData(data);
                toast.success("Análisis de IA completado");
            }
        } catch (error) {
            console.error("Error en IA:", error);
            toast.error("Error al generar insights");
            setShowAiModal(false);
        } finally {
            setAiLoading(false);
        }
    };

    const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <header>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Pólizas</h1>
                    <p className="text-gray-500 text-sm">Mostrando {policies?.length || 0} de {total} pólizas registradas.</p>
                </header>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" placeholder="Buscar..." defaultValue={q}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.currentTarget.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                    <button onClick={handleGenerateInsights} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-all">
                        <Sparkles size={18} /> <span className="hidden sm:inline">IA Insights</span>
                    </button>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-gray-50 border-b text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Póliza / Cliente</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4 text-right">Valor Asegurado</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse h-16 bg-gray-50/50">
                                        <td colSpan={4}></td>
                                    </tr>
                                ))
                            ) : policies && policies.length > 0 ? (
                                policies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{policy.policy_number}</div>
                                            <div className="text-gray-500 text-xs">{policy.customer}</div>
                                        </td>
                                        <td className="px-6 py-4">{policy.policy_type}</td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-600">{formatMoney(policy.insured_value_usd)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-bold", 
                                                policy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            )}>
                                                {policy.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-400">No se encontraron pólizas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-xl shadow-sm">
                <button 
                    disabled={page <= 1} 
                    onClick={() => setSearchParams({ page: (page - 1).toString(), q })} 
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-30 flex items-center gap-1"
                >
                    <ChevronLeft size={18} /> Anterior
                </button>
                <span className="text-sm font-medium">Página {page}</span>
                <button 
                    disabled={!policies || policies.length < 10} 
                    onClick={() => setSearchParams({ page: (page + 1).toString(), q })} 
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-30 flex items-center gap-1"
                >
                    Siguiente <ChevronRight size={18} />
                </button>
            </div>

            {showAiModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                            <span className="flex items-center gap-2 font-bold"><Sparkles size={20} /> Asistente IA</span>
                            <button onClick={() => setShowAiModal(false)}><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            {aiLoading ? (
                                <div className="flex flex-col items-center py-8">
                                    <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
                                    <p>Analizando datos...</p>
                                </div>
                            ) : aiData ? (
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="bg-purple-50 p-3 rounded-lg flex-1 text-center">
                                            <div className="text-2xl font-bold text-purple-700">{aiData.highlights?.total_policies || 0}</div>
                                            <div className="text-xs font-bold text-purple-600 uppercase">Analizadas</div>
                                        </div>
                                        <div className="bg-orange-50 p-3 rounded-lg flex-1 text-center border-orange-100 border">
                                            <div className="text-2xl font-bold text-orange-700">{aiData.highlights?.risk_flags || 0}</div>
                                            <div className="text-xs font-bold text-orange-600 uppercase">Riesgos</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-gray-900">Hallazgos y Recomendaciones:</h4>
                                        {aiData.insights?.map((text: string, i: number) => (
                                            <div key={i} className="flex gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
                                                <div className="text-purple-600 font-bold">•</div>
                                                <div>{text}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setShowAiModal(false)} className="w-full py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cerrar</button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}