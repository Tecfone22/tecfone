
import React from 'react';
import { X, Printer, Smartphone, CheckCircle2 } from 'lucide-react';
import { Sale, Product } from '../types';

interface Props {
  sale: Sale;
  products: Product[];
  onClose: () => void;
}

const ReceiptModal: React.FC<Props> = ({ sale, products, onClose }) => {
  const handlePrint = () => window.print();
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Producto';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:p-0">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl print:shadow-none print:rounded-none overflow-hidden">
        <div className="p-6 bg-emerald-500 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3"><CheckCircle2 size={24} /> <h3 className="font-black text-xl">Venta Exitosa</h3></div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full"><X size={20} /></button>
        </div>

        <div id="printable-receipt" className="p-8 font-mono text-slate-800 print:text-black">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black tracking-tighter mb-1 uppercase">TECFONE</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Servicio Técnico & Electrónica</p>
            <div className="border-b border-dashed border-slate-200 my-4"></div>
            <div className="text-left text-xs space-y-1">
              <p><b>TICKET:</b> {sale.id}</p>
              <p><b>FECHA:</b> {sale.date}</p>
            </div>
          </div>

          <table className="w-full text-xs mb-6">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="py-2">DESCRIPCIÓN</th>
                <th className="py-2 text-center">CANT</th>
                <th className="py-2 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2">{getProductName(item.productId)}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-xl font-black"><span>TOTAL:</span> <span>${sale.total.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex gap-4 print:hidden">
          <button onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-200">Cerrar</button>
          <button onClick={handlePrint} className="flex-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
            <Printer size={20} /> IMPRIMIR
          </button>
        </div>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #printable-receipt, #printable-receipt * { visibility: visible; } #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
};

export default ReceiptModal;