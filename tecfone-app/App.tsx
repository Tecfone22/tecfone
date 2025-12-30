import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Wrench, Sparkles, Smartphone 
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Repairs from './components/Repairs';
import AIAssistant from './components/AIAssistant';
import ReceiptModal from './components/ReceiptModal';
import { Product, RepairOrder, Sale } from './types';

const DEFAULT_CATEGORIES = ['Celulares', 'Electrónica', 'Accesorios', 'Repuestos'];

const App = () => {
  const [view, setView] = useState('dashboard');
  const [activeReceipt, setActiveReceipt] = useState<Sale | null>(null);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tecfone_products');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [repairs, setRepairs] = useState<RepairOrder[]>(() => {
    const saved = localStorage.getItem('tecfone_repairs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('tecfone_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('tecfone_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('tecfone_products', JSON.stringify(products));
    localStorage.setItem('tecfone_repairs', JSON.stringify(repairs));
    localStorage.setItem('tecfone_sales', JSON.stringify(sales));
    localStorage.setItem('tecfone_categories', JSON.stringify(categories));
  }, [products, repairs, sales, categories]);

  const handleSale = (cartItems: { productId: string; quantity: number; price: number }[]) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newSale: Sale = {
      id: `V-${Date.now()}`,
      items: cartItems,
      total,
      date: new Date().toLocaleString()
    };
    setSales(prev => [newSale, ...prev]);
    setProducts(prevProducts => prevProducts.map(p => {
      const soldItem = cartItems.find(item => item.productId === p.id);
      return soldItem ? { ...p, stock: p.stock - soldItem.quantity, lastUpdated: new Date().toISOString().split('T')[0] } : p;
    }));
    setActiveReceipt(newSale);
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setView(id)}
      className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all ${view === id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      <Icon size={20} /> <span className="font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl text-white"><Smartphone size={24} /></div>
          <h1 className="text-2xl font-black text-slate-800">TECFONE</h1>
        </div>
        <nav className="space-y-2 flex-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Panel" />
          <NavItem id="inventory" icon={Package} label="Inventario" />
          <NavItem id="sales" icon={ShoppingCart} label="Ventas" />
          <NavItem id="repairs" icon={Wrench} label="Taller" />
          <NavItem id="ai-assistant" icon={Sparkles} label="IA Ayuda" />
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12">
        {view === 'dashboard' && <Dashboard products={products} repairs={repairs} sales={sales} onPrintReceipt={setActiveReceipt} />}
        {view === 'inventory' && <Inventory products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} />}
        {view === 'sales' && <Sales products={products} onSale={handleSale} />}
        {view === 'repairs' && <Repairs repairs={repairs} setRepairs={setRepairs} />}
        {view === 'ai-assistant' && <AIAssistant />}
      </main>

      {activeReceipt && <ReceiptModal sale={activeReceipt} products={products} onClose={() => setActiveReceipt(null)} />}
    </div>
  );
};
export default App;
