
import React, { useState } from 'react';
import { Product } from '../types';
import { 
  ShoppingCart, 
  Search, 
  Trash2, 
  CreditCard, 
  Plus, 
  Minus,
  ShoppingBag
} from 'lucide-react';

interface Props {
  products: Product[];
  onSale: (items: { productId: string; quantity: number; price: number }[]) => void;
}

const Sales: React.FC<Props> = ({ products, onSale }) => {
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { productId: product.id, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          if (newQty > product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  const processSale = () => {
    if (cart.length === 0) return;
    
    // Mapear el carrito para incluir el precio actual del producto en el momento de la venta
    const finalItems = cart.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: p?.price || 0
      };
    });

    onSale(finalItems);
    setCart([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-500">
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="text-blue-600" size={24} />
              Selección de Productos
            </h2>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o categoría..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="flex flex-col p-4 border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group bg-white active:scale-[0.98]"
              >
                <div className="relative aspect-square w-full bg-slate-50 rounded-xl overflow-hidden mb-3">
                  <img 
                    src={p.image || `https://picsum.photos/seed/${p.id}/200`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt={p.name} 
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg ${p.stock < 5 ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                      {p.stock} disp.
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.category}</p>
                  <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight h-10">{p.name}</h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xl font-black text-blue-600">${p.price}</span>
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Plus size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl flex flex-col h-[calc(100vh-10rem)] sticky top-8">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-xl">
              <ShoppingCart size={22} className="text-blue-600" />
              Resumen de Venta
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-10">
                <ShoppingCart size={40} className="opacity-20 mb-4" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              cart.map(item => {
                const p = products.find(prod => prod.id === item.productId);
                if (!p) return null;
                return (
                  <div key={item.productId} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                    <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      <img src={p.image || `https://picsum.photos/seed/${p.id}/100`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-slate-800 truncate">{p.name}</h5>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 text-slate-400 hover:text-blue-600"><Minus size={14} /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 text-slate-400 hover:text-blue-600"><Plus size={14} /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-800 text-sm">${item.quantity * p.price}</span>
                      <button onClick={() => removeFromCart(item.productId)} className="block mt-1 text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-b-[2rem] shadow-2xl">
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="text-3xl font-black text-blue-400">${cartTotal}</span>
            </div>
            <button 
              disabled={cart.length === 0}
              onClick={processSale}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all"
            >
              <CreditCard size={20} />
              CONFIRMAR PAGO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;