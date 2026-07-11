import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon, Sparkles } from 'lucide-react';

const ProductsView = () => {
  const { products, addProduct, updateProduct, deleteProduct, clearProducts } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Solar Water Heater',
    model: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '',
    lowStockThreshold: '3',
    image: ''
  });

  const categories = ['All', 'Solar Water Heater', 'Water Purifier', 'UPS'];

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Solar Water Heater',
      model: '',
      purchasePrice: '',
      sellingPrice: '',
      stock: '',
      lowStockThreshold: '3',
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      model: product.model,
      purchasePrice: product.purchasePrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      image: product.image || ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.model || !formData.purchasePrice || !formData.sellingPrice || !formData.stock) {
      alert("Please fill in all required fields.");
      return;
    }

    const pPrice = parseFloat(formData.purchasePrice);
    const sPrice = parseFloat(formData.sellingPrice);

    if (sPrice < pPrice) {
      if (!window.confirm("Warning: Selling price is less than purchase price. Do you want to save anyway?")) {
        return;
      }
    }

    // Default image if empty
    let imgUrl = formData.image;
    if (!imgUrl) {
      if (formData.category === 'Solar Water Heater') {
        imgUrl = "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400";
      } else if (formData.category === 'Water Purifier') {
        imgUrl = "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=400";
      } else {
        imgUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400";
      }
    }

    const itemData = {
      ...formData,
      image: imgUrl
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, itemData);
    } else {
      addProduct(itemData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(id);
    }
  };

  const handleClearAll = () => {
    clearProducts();
  };

  const handleIncrementStock = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct(productId, {
        ...product,
        stock: product.stock + 1
      });
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, brand, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Categories Pills & Action */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          <div className="flex space-x-1.5 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150
                  ${selectedCategory === cat 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' 
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                {cat === 'All' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {products.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="flex items-center space-x-1.5 px-3 py-2 border border-rose-250 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-650 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 dark:shadow-none transition-all duration-150 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

      </div>

      {/* Products Table List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden border-collapse">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4 text-right">Dealer Buy</th>
                <th className="py-3.5 px-4 text-right">SRP Store</th>
                <th className="py-3.5 px-4 text-right">Margin</th>
                <th className="py-3.5 px-4 text-center">Stock Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredProducts.map((p) => {
                const margin = p.sellingPrice - p.purchasePrice;
                const marginPercentage = p.sellingPrice ? Math.round((margin / p.sellingPrice) * 100) : 0;
                
                // Stock badge styling
                let stockTextClass = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20';
                let stockLabel = 'In Stock';
                if (p.stock === 0) {
                  stockTextClass = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20';
                  stockLabel = 'Out of Stock';
                } else if (p.stock <= p.lowStockThreshold) {
                  stockTextClass = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20';
                  stockLabel = 'Low Stock';
                }

                // Category tag styling
                let catBadgeClass = '';
                if (p.category === 'Solar Water Heater') {
                  catBadgeClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
                } else if (p.category === 'Water Purifier') {
                  catBadgeClass = 'bg-sky-500/10 text-sky-600 dark:text-sky-400';
                } else {
                  catBadgeClass = 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
                }

                return (
                  <tr 
                    key={p.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors text-xs text-slate-700 dark:text-slate-300"
                  >
                    {/* Name & Model & Category */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800 dark:text-white text-xs">
                            {p.name}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${catBadgeClass}`}>
                            {p.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                          <span className="font-mono bg-slate-50 dark:bg-slate-800 px-1 py-0.2 rounded uppercase">
                            MOD: {p.model}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-4 px-4 font-semibold text-slate-500 dark:text-slate-400">
                      {p.brand}
                    </td>

                    {/* Purchase Price */}
                    <td className="py-4 px-4 text-right font-medium text-slate-500 dark:text-slate-400">
                      {formatCurrency(p.purchasePrice)}
                    </td>

                    {/* Selling Price */}
                    <td className="py-4 px-4 text-right font-extrabold text-slate-800 dark:text-white">
                      {formatCurrency(p.sellingPrice)}
                    </td>

                    {/* Margin */}
                    <td className="py-4 px-4 text-right">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                        +{formatCurrency(margin)}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-550 block">
                        ({marginPercentage}%)
                      </span>
                    </td>

                    {/* Stock Level */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                          {p.stock} Units
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${stockTextClass}`}>
                          {stockLabel}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleIncrementStock(p.id)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/20 text-indigo-650 dark:text-indigo-400 font-bold text-[9px] transition-all duration-150 active:scale-95 cursor-pointer"
                        >
                          <span>+1 Stock</span>
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg border border-rose-100 dark:border-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 dark:text-rose-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Register New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Product Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Aura Water Purifier RO"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Brand Name *</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Aura, V-Guard"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Model Number *</label>
                  <input 
                    type="text" 
                    name="model" 
                    value={formData.model} 
                    onChange={handleInputChange} 
                    placeholder="e.g. VG-SOL-200"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Category *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                  >
                    <option value="Solar Water Heater">Solar Water Heater</option>
                    <option value="Water Purifier">Water Purifier</option>
                    <option value="UPS">UPS</option>
                  </select>
                </div>

                {/* Available Stock */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Available Stock *</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 10"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Purchase Price */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Purchase Price (₹) *</label>
                  <input 
                    type="number" 
                    name="purchasePrice" 
                    value={formData.purchasePrice} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 12000"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Selling Price */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Selling Price (₹) *</label>
                  <input 
                    type="number" 
                    name="sellingPrice" 
                    value={formData.sellingPrice} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 15000"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Low Stock Threshold */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Low Stock Alert Level</label>
                  <input 
                    type="number" 
                    name="lowStockThreshold" 
                    value={formData.lowStockThreshold} 
                    onChange={handleInputChange} 
                    placeholder="3"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>

                {/* Product Image URL */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg (Optional)"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>
              </div>

              {/* Form submit footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 dark:shadow-none transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsView;
