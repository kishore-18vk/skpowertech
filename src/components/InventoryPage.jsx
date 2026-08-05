import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Minus, Edit2, Trash2, PlusCircle, Search, Folder, Package, X, RotateCcw, Sun, Zap, Droplet } from 'lucide-react';

const categories = [
  'Solar Water Heater',
  'Water Purifier',
  'UPS Inverter',
  'Batteries',
  'Electric Heater',
  'Spare Parts'
];

// Color mapping for cards and accents based on category
const categoryColors = {
  'Solar Water Heater': {
    bg: 'bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-950/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  },
  'Water Purifier': {
    bg: 'bg-blue-500/10 border-blue-500/20 dark:bg-blue-950/20',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
  },
  'UPS Inverter': {
    bg: 'bg-orange-500/10 border-orange-500/20 dark:bg-orange-950/20',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
  },
  'Batteries': {
    bg: 'bg-amber-500/10 border-amber-500/20 dark:bg-amber-955/20',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
  },
  'Electric Heater': {
    bg: 'bg-rose-500/10 border-rose-500/20 dark:bg-rose-955/20',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
  },
  'Spare Parts': {
    bg: 'bg-slate-500/10 border-slate-500/20 dark:bg-slate-955/20',
    text: 'text-slate-600 dark:text-slate-400',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-300'
  }
};

const getCategoryColor = (cat) => {
  return categoryColors[cat] || {
    bg: 'bg-slate-500/10 border-slate-500/20 dark:bg-slate-955/20',
    text: 'text-slate-600 dark:text-slate-400',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-300'
  };
};

const InventoryPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, loadDemoData } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('solar');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Inputs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[0]);
  const [newProductStock, setNewProductStock] = useState('0');

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStock, setEditStock] = useState('0');

  // Handlers
  const handleIncrement = (id) => {
    const prod = products.find(p => p.id === id);
    if (prod) {
      updateProduct(id, { stock: prod.stock + 1 });
    }
  };

  const handleDecrement = (id) => {
    const prod = products.find(p => p.id === id);
    if (prod && prod.stock > 0) {
      updateProduct(id, { stock: prod.stock - 1 });
    }
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const nameStr = newProductName.trim();
    const firstWord = nameStr.split(' ')[0] || 'Generic';
    const restWords = nameStr.split(' ').slice(1).join(' ') || 'Generic';

    addProduct({
      name: nameStr,
      brand: firstWord,
      model: restWords,
      category: newProductCategory,
      stock: Math.max(0, parseInt(newProductStock) || 0),
      purchasePrice: 0,
      sellingPrice: 0,
      lowStockThreshold: 3
    });

    // Switch tab to the category group of the newly created product & reset search filter
    setActiveSubTab(getProductGroup(newProductCategory));
    setSearchQuery('');

    setNewProductName('');
    setNewProductStock('0');
    setIsAddOpen(false);
  };

  const startEditing = (p) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditStock(String(p.stock));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingProduct) return;

    const nameStr = editName.trim();
    const firstWord = nameStr.split(' ')[0] || 'Generic';
    const restWords = nameStr.split(' ').slice(1).join(' ') || 'Generic';

    updateProduct(editingProduct.id, {
      name: nameStr,
      brand: firstWord,
      model: restWords,
      stock: Math.max(0, parseInt(editStock) || 0)
    });

    setEditingProduct(null);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to reset the stock list to the default products? Custom products will be lost.")) {
      loadDemoData();
    }
  };

  // Group mappings
  const getProductGroup = (category) => {
    if (category === 'Solar Water Heater' || category === 'Electric Heater') {
      return 'solar';
    }
    if (category === 'UPS Inverter' || category === 'Batteries') {
      return 'ups';
    }
    if (category === 'Water Purifier' || category === 'Spare Parts') {
      return 'water';
    }
    return 'solar';
  };

  // Filtered list by query and active tab
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = getProductGroup(p.category) === activeSubTab;
    return matchesSearch && matchesTab;
  });

  // Group products by category
  const productsByCategory = filteredProducts.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = [];
    }
    acc[p.category].push(p);
    return acc;
  }, {});

  // Group counters
  const solarProds = products.filter(p => getProductGroup(p.category) === 'solar');
  const solarStock = solarProds.reduce((acc, p) => acc + p.stock, 0);

  const upsProds = products.filter(p => getProductGroup(p.category) === 'ups');
  const upsStock = upsProds.reduce((acc, p) => acc + p.stock, 0);

  const waterProds = products.filter(p => getProductGroup(p.category) === 'water');
  const waterStock = waterProds.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* 3 Main Product Pages selector Tabs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tab 1: Solar Water Heater */}
        <button
          onClick={() => setActiveSubTab('solar')}
          className={`relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            activeSubTab === 'solar'
              ? 'bg-gradient-to-br from-emerald-50/70 to-emerald-50/20 dark:from-emerald-950/20 dark:to-transparent border-emerald-500 shadow-md shadow-emerald-100 dark:shadow-none'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${activeSubTab === 'solar' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Sun className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-slate-800 dark:text-white">Solar & Heaters</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">SK Solar & Heating</p>
              </div>
            </div>
            {activeSubTab === 'solar' && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{solarProds.length} Models</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{solarStock} In Stock</span>
          </div>
        </button>

        {/* Tab 2: UPS & Batteries */}
        <button
          onClick={() => setActiveSubTab('ups')}
          className={`relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            activeSubTab === 'ups'
              ? 'bg-gradient-to-br from-amber-50/70 to-amber-50/20 dark:from-amber-950/20 dark:to-transparent border-amber-500 shadow-md shadow-amber-100 dark:shadow-none'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${activeSubTab === 'ups' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Zap className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-slate-800 dark:text-white">UPS & Batteries</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Backup power</p>
              </div>
            </div>
            {activeSubTab === 'ups' && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{upsProds.length} Models</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{upsStock} In Stock</span>
          </div>
        </button>

        {/* Tab 3: Water Purifiers */}
        <button
          onClick={() => setActiveSubTab('water')}
          className={`relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            activeSubTab === 'water'
              ? 'bg-gradient-to-br from-blue-50/70 to-blue-50/20 dark:from-blue-950/20 dark:to-transparent border-blue-500 shadow-md shadow-blue-100 dark:shadow-none'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${activeSubTab === 'water' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Droplet className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-slate-800 dark:text-white">Purifiers & Spares</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Pure RO & Spare Parts</p>
              </div>
            </div>
            {activeSubTab === 'water' && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{waterProds.length} Models</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{waterStock} In Stock</span>
          </div>
        </button>
      </section>

      {/* Toolbar */}
      <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${activeSubTab === 'solar' ? 'Solar Water Heater' : activeSubTab === 'ups' ? 'UPS & Batteries' : 'Water Purifier'}...`}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleResetToDefault}
            title="Reset Stock to Default Template"
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer w-1/3 sm:w-auto"
          >
            <RotateCcw size={15} />
            <span className="sm:inline">Reset</span>
          </button>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-colors cursor-pointer w-2/3 sm:w-auto"
          >
            <PlusCircle size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </section>

      {/* Product Sections grouped by Category */}
      <section className="space-y-6">
        {Object.keys(productsByCategory).length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Package className="w-12 h-12 text-slate-350 mx-auto mb-3" />
            <p className="font-semibold text-slate-500">No products found matching your search.</p>
          </div>
        ) : (
          Object.entries(productsByCategory).map(([categoryName, prodList]) => {
            const colors = getCategoryColor(categoryName);
            return (
              <div key={categoryName} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                
                {/* Category Title Card Header */}
                <div className={`px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2.5 ${colors.bg}`}>
                  <Folder size={16} className={colors.text} />
                  <h3 className="font-display font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {categoryName}
                  </h3>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {prodList.length} items
                  </span>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/30">
                        <th className="px-3 sm:px-6 py-2.5 w-7/12">Product Name</th>
                        <th className="px-3 sm:px-6 py-2.5 w-2/12 text-center">Stock</th>
                        <th className="px-3 sm:px-6 py-2.5 w-3/12 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {prodList.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors">
                          {/* Product Name */}
                          <td className="px-3 sm:px-6 py-3">
                            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[160px] sm:max-w-none" title={product.name}>
                              {product.name}
                            </span>
                          </td>
                          
                          {/* Stock Indicator */}
                          <td className="px-3 sm:px-6 py-3 text-center">
                            <span className={`
                              inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black
                              ${product.stock > 0 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'}
                            `}>
                              {product.stock} <span className="hidden sm:inline ml-0.5">Units</span>
                            </span>
                          </td>

                          {/* Stock Increments & Edit Actions */}
                          <td className="px-3 sm:px-6 py-3 text-right">
                            <div className="inline-flex items-center space-x-1 sm:space-x-1.5">
                              {/* Minus */}
                              <button
                                onClick={() => handleDecrement(product.id)}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg border border-slate-200 dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                              
                              {/* Plus */}
                              <button
                                onClick={() => handleIncrement(product.id)}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => startEditing(product)}
                                title="Edit Product"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                title="Delete Product"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg border border-rose-200 dark:border-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })
        )}
      </section>

      {/* Add Product Modal Overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white">Add New Product</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white text-slate-850 dark:text-slate-200"
                  placeholder="e.g. V-Guard DAF 150"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-200"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Initial Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white text-slate-850 dark:text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Create Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal Overlay */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white">Edit Product Details</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white text-slate-850 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white text-slate-850 dark:text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryPage;
