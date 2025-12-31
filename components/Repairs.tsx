
import React, { useState } from 'react';
import { RepairOrder, RepairStatus } from '../types';
import { Clock, Plus, Filter, Search, ChevronRight, User, Smartphone, AlertCircle } from 'lucide-react';

interface Props {
  repairs: RepairOrder[];
  setRepairs: React.Dispatch<React.SetStateAction<RepairOrder[]>>;
}

const Repairs: React.FC<Props> = ({ repairs, setRepairs }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRepair, setNewRepair] = useState<Partial<RepairOrder>>({
    customerName: '', device: '', issue: '', status: RepairStatus.RECEIVED, estimatedCost: 0
  });

  const getStatusColor = (status: RepairStatus) => {
    switch (status) {
      case RepairStatus.RECEIVED: return 'bg-slate-100 text-slate-600';
      case RepairStatus.DIAGNOSING: return 'bg-blue-100 text-blue-600';
      case RepairStatus.REPAIRING: return 'bg-amber-100 text-amber-600';
      case RepairStatus.READY: return 'bg-emerald-100 text-emerald-600';
      case RepairStatus.DELIVERED: return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const addRepair = () => {
    if (!newRepair.customerName || !newRepair.device) return;
    const order: RepairOrder = {
      id: `R-${Math.floor(Math.random() * 900) + 100}`,
      customerName: newRepair.customerName!,
      device: newRepair.device!,
      issue: newRepair.issue || 'No especificado',
      status: RepairStatus.RECEIVED,
      date: new Date().toISOString().split('T')[0],
      estimatedCost: Number(newRepair.estimatedCost) || 0
    };
    setRepairs([order, ...repairs]);
    setShowAddModal(false);
    setNewRepair({ customerName: '', device: '', issue: '', status: RepairStatus.RECEIVED, estimatedCost: 0 });
  };

  const updateStatus = (id: string, newStatus: RepairStatus) => {
    setRepairs(repairs.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Servicio Técnico</h2>
          <p className="text-slate-500">Estado de reparaciones y órdenes de trabajo</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          <span>Ingresar Equipo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {repairs.map(repair => (
          <div key={repair.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-300 tracking-widest">{repair.id}</span>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(repair.status)}`}>
                {repair.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-2 rounded-lg text-slate-500"><User size={18} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Cliente</p>
                  <p className="font-bold text-slate-800">{repair.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-2 rounded-lg text-slate-500"><Smartphone size={18} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Equipo</p>
                  <p className="font-bold text-slate-800">{repair.device}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-slate-50 p-2 rounded-lg text-slate-500"><AlertCircle size={18} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Falla Reportada</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{repair.issue}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="text-sm text-slate-400 flex items-center gap-1">
                <Clock size={14} />
                {repair.date}
              </div>
              <div className="font-black text-blue-600">${repair.estimatedCost}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <select 
                onChange={(e) => updateStatus(repair.id, e.target.value as RepairStatus)}
                className="col-span-2 text-xs bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                value={repair.status}
              >
                {Object.values(RepairStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Plus size={18} className="text-blue-600" /></div>
              Nueva Orden de Reparación
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Nombre del Cliente</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Carlos Slim"
                  value={newRepair.customerName}
                  onChange={(e) => setNewRepair({...newRepair, customerName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Equipo (Modelo / Color)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: iPhone 14 Pro Max Púrpura"
                  value={newRepair.device}
                  onChange={(e) => setNewRepair({...newRepair, device: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Falla / Descripción</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Describe el problema que reporta el cliente..."
                  value={newRepair.issue}
                  onChange={(e) => setNewRepair({...newRepair, issue: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Costo Estimado ($)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRepair.estimatedCost}
                  onChange={(e) => setNewRepair({...newRepair, estimatedCost: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={addRepair}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-colors"
              >
                Registrar Ingreso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repairs;
