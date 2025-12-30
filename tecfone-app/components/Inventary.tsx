
import React, { useState } from 'react';
import { Plus, Search, Tags, Trash2, X, Package, Save } from 'lucide-react';
import { Product } from '../types';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const Inventory: React.FC<Props> = ({ products, setProducts, categories, setCategories }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, stock: 0, category: categories[0] });

  const addCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat('');
    }
  };

  const removeCategory = (cat: string) => {
    if (products.some(p => p.category === cat)) return alert("Categoría en uso");
    setCategories(categories.filter(c => c !== cat));
  };

  const saveProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const p: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      category: newProduct.category || categories[0],
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      lastUpdated: new Date().toISOString().split('T')[0],
      stockHistory: [],
      image: `https://picsum.photos/seed/${newProduct.name}/200`
    };
    setProducts([...products, p]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowCatModal(true)} className="flex items-center gap-2 bg-white border p-2 rounded-xl text-slate-600"><Tags size={18}/> Categorías</button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white p-2 px-4 rounded-xl"><Plus size={18}/> Nuevo</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
            <tr><th className="p-4">Producto</th><th className="p-4">Categoría</th><th className="p-4">Precio</th><th className="p-4">Stock</th></tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold">{p.name}</td>
                <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">{p.category}</span></td>
                <td className="p-4">${p.price}</td>
                <td className={`p-4 font-bold ${p.stock < 5 ? 'text-rose-500' : ''}`}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm">
            <div className="flex justify-between mb-4"><h3 className="font-bold">Categorías</h3><button onClick={()=>setShowCatModal(false)}><X/></button></div>
            <div className="flex gap-2 mb-4">
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} className="border flex-1 p-2 rounded-lg" placeholder="Nueva..."/>
              <button onClick={addCategory} className="bg-blue-600 text-white p-2 rounded-lg"><Plus/></button>
            </div>
            <div className="space-y-2">
              {categories.map(c => (
                <div key={c} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span>{c}</span><button onClick={()=>removeCategory(c)} className="text-rose-500"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-xl">Nuevo Producto</h3>
            <input placeholder="Nombre" className="w-full border p-3 rounded-xl" onChange={e=>setNewProduct({...newProduct, name: e.target.value})}/>
            <select className="w-full border p-3 rounded-xl" onChange={e=>setNewProduct({...newProduct, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-4">
              <input placeholder="Precio" type="number" className="w-full border p-3 rounded-xl" onChange={e=>setNewProduct({...newProduct, price: Number(e.target.value)})}/>
              <input placeholder="Stock" type="number" className="w-full border p-3 rounded-xl" onChange={e=>setNewProduct({...newProduct, stock: Number(e.target.value)})}/>
            </div>
            <button onClick={saveProduct} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Guardar Producto</button>
            <button onClick={()=>setShowAddModal(false)} className="w-full text-slate-400">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Inventory;
