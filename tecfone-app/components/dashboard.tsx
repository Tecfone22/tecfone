
import React from 'react';
import { 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  PackageSearch,
  ShoppingCart,
  Printer
} from 'lucide-react';
import { Product, RepairOrder, Sale } from '../types';

interface Props {
  products: Product[];
  repairs: RepairOrder[];
  sales: Sale[];
  onPrintReceipt: (sale: Sale) => void;
}

const Dashboard: React.FC<Props> = ({ products, repairs, sales, onPrintReceipt }) => {
  const totalIncome = sales.reduce((acc, s) => acc + s.total, 0);
  const pendingRepairs = repairs.filter(r => r.status !== 'Entregado').length;
  const lowStock = products.filter(p => p.stock < 5).length;
  const completedRepairs = repairs.filter(r => r.status === 'Entregado' || r.status === 'Listo para Entrega').length;

  const StatCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp size={14} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
        {subValue && <p className="text-slate-400 text-xs mt-1 font-medium">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Panel Principal</h2>
          <p className="text-slate-500 font-medium">Resumen general de Tecfone para hoy</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700">Sistema en línea</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ingresos Totales" 
          value={`$${totalIncome.toLocaleString()}`} 
          subValue="Ventas confirmadas"
          icon={DollarSign} 
          color="bg-emerald-500"
          trend="+12%"
        />
        <StatCard 
          title="Técnico Pendiente" 
          value={pendingRepairs} 
          subValue="Equipos en taller"
          icon={Clock} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Bajo Stock" 
          value={lowStock} 
          subValue="Necesitan reposición"
          icon={AlertTriangle} 
          color="bg-rose-500" 
        />
        <StatCard 
          title="Reparaciones Ok" 
          value={completedRepairs} 
          subValue="Listos o entregados"
          icon={CheckCircle} 
          color="bg-blue-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertas de Stock */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
              <PackageSearch className="text-rose-500" />
              Alertas de Inventario
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase">Reposición urgente</span>
          </div>
          
          <div className="space-y-4">
            {products.filter(p => p.stock < 5).length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                Todo el stock está en niveles óptimos.
              </div>
            ) : (
              products.filter(p => p.stock < 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-rose-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 font-black text-rose-500 group-hover:scale-110 transition-transform">
                      {p.stock}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400 uppercase font-black">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-tighter">Stock Crítico</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Ventas */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
              <ShoppingCart className="text-blue-600" />
              Actividad Reciente
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase">Ventas hoy</span>
          </div>

          <div className="space-y-4">
            {sales.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                No hay ventas registradas todavía.
              </div>
            ) : (
              sales.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 font-bold">
                      ID
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Venta #{s.id.slice(-4)}</p>
                      <p className="text-xs text-slate-400">{s.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-black text-emerald-600 text-lg">+${s.total.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => onPrintReceipt(s)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Imprimir Recibo"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;