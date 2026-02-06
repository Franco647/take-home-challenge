import { useState, type ChangeEvent } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, X, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import clsx from 'clsx';
import { toast } from 'sonner';
import type { UploadData } from '../../types';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<UploadData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const handleReset = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setLoading(false);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const toastId = toast.loading("Procesando archivo CSV..."); 

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const { data } = await api.post<UploadData>('/policies/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data) {
                setResult(data);
                toast.success(`Carga exitosa: ${data.inserted_count} insertadas`, { id: toastId }); 
            } else {
                throw new Error("Error en el procesamiento");
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            const msg = err.response?.data?.message || err.message || "Error en el servidor";
            toast.error(msg, { id: toastId });
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Subir Pólizas (CSV)</h1>
                <p className="text-gray-500 text-sm">Selecciona el archivo CSV para procesar las nuevas pólizas.</p>
            </div>

            {!result && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 transition-all animate-fade-in-up">
                    <div className={clsx(
                        "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                        file ? "border-brand-300 bg-brand-50/50" : "border-gray-300 hover:bg-gray-50"
                    )}>
                        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" disabled={loading} />
                        <label htmlFor="file-upload" className={clsx("flex flex-col items-center", loading ? "cursor-not-allowed" : "cursor-pointer")}>
                            <div className={clsx("p-4 rounded-full mb-4", file ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-400")}>
                               <UploadCloud size={32} />
                            </div>
                            <span className="text-lg font-medium text-gray-900">{file ? file.name : 'Haz clic para seleccionar un archivo CSV'}</span>
                        </label>
                    </div>
                    {file && (
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={handleReset} disabled={loading} className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium text-gray-600">Cancelar</button>
                            <button onClick={handleUpload} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                                Procesar Archivo
                            </button>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-700 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={24} />
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError(null)}><X size={18} /></button>
                </div>
            )}

            {/* --- MOSTRAR RESULTADOS (Trazabilidad) --- */}
            {result && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
                    <div className="p-6 border-b border-gray-100 bg-green-50">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={24} />
                            <div>
                                <h3 className="font-bold text-green-900 text-lg">Proceso Completado</h3>
                                <p className="text-sm text-green-700 font-mono">ID de Operación: {result.operation_id}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500 mb-1">Filas Insertadas</p>
                            <p className="text-3xl font-bold text-green-600">{result.inserted_count}</p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500 mb-1">Filas Rechazadas</p>
                            <p className={clsx("text-3xl font-bold", result.rejected_count > 0 ? "text-red-500" : "text-gray-900")}>
                                {result.rejected_count}
                            </p>
                        </div>
                    </div>

                    {/* Tabla/lista de errores por fila */}
                    {result.errors.length > 0 && (
                        <div className="p-6 bg-gray-50">
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-orange-500" /> Detalle de Rechazos
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {result.errors.map((err, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded border border-gray-200 text-sm">
                                        <div className="flex justify-between">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Fila {err.row_number}</span>
                                            <span className="font-medium text-red-600">{err.code}</span>
                                        </div>
                                        <p className="text-gray-600 mt-1">{err.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-gray-50 border-t flex justify-end">
                        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 font-medium transition-all">
                            <RefreshCw size={18} /> Subir otro archivo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}