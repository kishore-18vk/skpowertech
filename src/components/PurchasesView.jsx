import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { formatCurrency, exportToCSV } from '../utils/helpers';
import { downloadPurchasePDF } from '../utils/pdfGenerator';
import { 
  ShoppingBag, 
  Truck, 
  Building2, 
  Phone, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Search, 
  TrendingUp, 
  PackageCheck, 
  DollarSign, 
  Sparkles,
  CreditCard,
  Layers,
  Zap,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  FileSpreadsheet,
  FileType
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

const PurchasesView = () => {
  const { products, purchases, addPurchase, deletePurchase, setActiveTab } = useContext(AppContext);

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // View mode toggle: 'entry' or 'report'
  const [viewMode, setViewMode] = useState('entry');

  // Invoice Header Form State
  const [headerData, setHeaderData] = useState({
    supplierName: '',
    supplierPhone: '',
    invoiceNo: `PUR-${Math.floor(100000 + Math.random() * 900000)}`,
    date: getTodayStr(),
    paymentStatus: 'Paid',
    paymentMethod: 'Net Banking',
    notes: ''
  });

  // Multi-item Line Items State (Starts with 1 empty row)
  const [items, setItems] = useState([
    { id: 'row-1', productId: '', quantity: '5', purchasePrice: '', totalAmount: '' }
  ]);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

  // Handle Header change
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Line Item field change
  const handleItemChange = (index, field, value) => {
    setItems(prevItems => {
      const updated = [...prevItems];
      const currentItem = { ...updated[index], [field]: value };

      if (field === 'quantity' || field === 'purchasePrice') {
        const qty = parseInt(field === 'quantity' ? value : currentItem.quantity) || 0;
        const price = parseFloat(field === 'purchasePrice' ? value : currentItem.purchasePrice) || 0;
        if (price > 0 && qty > 0) {
          currentItem.totalAmount = (qty * price).toString();
        }
      } else if (field === 'totalAmount') {
        const total = parseFloat(value) || 0;
        const qty = parseInt(currentItem.quantity) || 1;
        if (qty > 0) {
          currentItem.purchasePrice = (total / qty).toFixed(2).toString();
        }
      }

      updated[index] = currentItem;
      return updated;
    });
  };

  // Add a new line item row
  const handleAddItemRow = () => {
    setItems(prev => [
      ...prev,
      { id: `row-${Date.now()}-${Math.random()}`, productId: '', quantity: '1', purchasePrice: '', totalAmount: '' }
    ]);
  };

  // Remove a line item row
  const handleRemoveItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Quick Preset Helper for V-Guard / Sudarson orders (e.g., TRV-HOT 200 PRO, 100L, 150L, 200L)
  const handleLoadPresetOrder = (brandPrefix = 'V-Guard') => {
    const prod100 = products.find(p => (p.name.includes('100') || p.name.includes('TRV-HOT 100')) && p.brand.toLowerCase().includes(brandPrefix.toLowerCase()));
    const prod150 = products.find(p => (p.name.includes('150') || p.name.includes('TRV-HOT 150')) && p.brand.toLowerCase().includes(brandPrefix.toLowerCase()));
    const prod200 = products.find(p => (p.name.includes('200') || p.name.includes('TRV-HOT 200')) && p.brand.toLowerCase().includes(brandPrefix.toLowerCase()));

    const presetRows = [];

    if (prod100) {
      presetRows.push({
        id: `row-preset-100`,
        productId: prod100.id,
        quantity: '5',
        purchasePrice: '',
        totalAmount: ''
      });
    }

    if (prod150) {
      presetRows.push({
        id: `row-preset-150`,
        productId: prod150.id,
        quantity: '3',
        purchasePrice: '',
        totalAmount: ''
      });
    }

    if (prod200) {
      presetRows.push({
        id: `row-preset-200`,
        productId: prod200.id,
        quantity: '5',
        purchasePrice: '',
        totalAmount: ''
      });
    }

    if (presetRows.length > 0) {
      setItems(presetRows);
      setHeaderData(prev => ({
        ...prev,
        supplierName: brandPrefix === 'V-Guard' ? 'V-Guard Industries Ltd' : 'Sudarson Solar Systems'
      }));
    }
  };

  // Submit Order Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!headerData.supplierName.trim()) {
      setErrorMessage("Please enter Supplier / Vendor name.");
      return;
    }

    const validItems = items.filter(it => it.productId && parseInt(it.quantity) > 0);

    if (validItems.length === 0) {
      setErrorMessage("Please select at least one equipment product and quantity.");
      return;
    }

    const payload = {
      ...headerData,
      items: validItems
    };

    const result = await addPurchase(payload);

    if (result && result.success) {
      const totalUnits = validItems.reduce((acc, it) => acc + parseInt(it.quantity), 0);
      setSuccessMessage(`✅ Purchase Order Saved! Stock increased (+${totalUnits} units) in Products catalog!`);

      // Reset form
      setHeaderData({
        supplierName: '',
        supplierPhone: '',
        invoiceNo: `PUR-${Math.floor(100000 + Math.random() * 900000)}`,
        date: getTodayStr(),
        paymentStatus: 'Paid',
        paymentMethod: 'Net Banking',
        notes: ''
      });

      setItems([
        { id: 'row-1', productId: '', quantity: '5', purchasePrice: '', totalAmount: '' }
      ]);

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } else {
      setErrorMessage(`❌ Purchase Order Failed: ${result?.error || "Unable to process purchase entry."}`);
    }
  };

  // Export Purchase Report to CSV File
  const handleExportCSV = () => {
    const headers = ['Invoice No', 'Date', 'Supplier Name', 'Supplier Contact', 'Purchased Items & Qty', 'Total Units', 'Total Amount (INR)', 'Payment Status', 'Payment Method'];
    
    exportToCSV(
      `SK_Powertech_Purchase_Report_${getTodayStr()}`,
      headers,
      purchases,
      (p) => {
        const itemSummary = p.items && p.items.length > 0 
          ? p.items.map(i => `${i.productName} (Qty: ${i.quantity})`).join(' | ')
          : `${p.productName || 'Item'} (Qty: ${p.quantity || 1})`;
        
        return [
          p.invoiceNo,
          p.date,
          p.supplierName,
          p.supplierPhone || '-',
          itemSummary,
          p.totalUnits || p.quantity || 1,
          p.totalAmount || 0,
          p.paymentStatus,
          p.paymentMethod
        ];
      }
    );
  };

  // Print Purchase Report
  const handlePrint = () => {
    window.print();
  };

  // Calculations for Order Summary
  const grandTotal = items.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || (parseInt(item.quantity) || 0) * (parseFloat(item.purchasePrice) || 0)), 0);
  const totalUnits = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

  // KPI Metrics
  const totalPurchasesCount = purchases.length;
  const totalUnitsPurchased = purchases.reduce((sum, p) => {
    if (p.items && p.items.length > 0) {
      return sum + p.items.reduce((iSum, item) => iSum + (parseInt(item.quantity) || 0), 0);
    }
    return sum + (parseInt(p.quantity) || 0);
  }, 0);

  const totalSpentAmount = purchases.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0);

  // Filtered Purchases list
  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = 
      (p.supplierName && p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.invoiceNo && p.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.items && p.items.some(it => it.productName && it.productName.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = filterStatus === 'All' || p.paymentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-left pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl no-print">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-amber-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              Stock Inward & Purchase Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold">Purchase Management & Inward Entry</h1>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl">
            Record incoming stock (e.g. TRV HOT 200 PRO + 5 units). Catalog stock updates instantly in the Products view.
          </p>
        </div>

        {/* Navigation & Download Actions */}
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          
          <button 
            onClick={() => downloadPurchasePDF(filteredPurchases)}
            className="px-3.5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md"
            title="Download Purchase Report as PDF"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Download PDF Report</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-white/20"
            title="Download Purchase Report CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button 
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-white/20"
            title="Print Purchase Report PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className="px-3.5 py-2.5 bg-emerald-500/30 hover:bg-emerald-500/40 backdrop-blur-md rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-emerald-300/30"
          >
            <PackageCheck className="w-4 h-4 text-emerald-200" />
            <span>Products View ({products.length})</span>
          </button>

        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Total Purchase Orders</span>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{totalPurchasesCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Total Units Restocked</span>
            <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">+{totalUnitsPurchased} <span className="text-xs font-normal text-slate-400">units</span></h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Total Inward Investment</span>
            <h4 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{formatCurrency(totalSpentAmount)}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Active Catalog Items</span>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{products.length} <span className="text-xs font-normal text-slate-400">items</span></h4>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Multi-Item Purchase Form (Left 2 cols) & Summary Calculator (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">

        {/* Purchase Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div className="flex items-center space-x-2.5">
                <Plus className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-display font-extrabold text-slate-800 dark:text-white text-base">New Stock Purchase Entry</h3>
                  <p className="text-xs text-slate-400">Select product & quantity (e.g. TRV HOT 200 PRO + 5). Stock adds to Products catalog immediately.</p>
                </div>
              </div>

              {/* Preset Shortcuts */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => handleLoadPresetOrder('V-Guard')}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-all"
                >
                  <Zap size={11} />
                  <span>V-Guard (100, 150, 200L)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadPresetOrder('Sudarson')}
                  className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-all"
                >
                  <Zap size={11} />
                  <span>Sudarson Batch</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            {successMessage && (
              <div className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400 rounded-2xl text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-3 py-1 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px] hover:bg-emerald-700 transition-all shrink-0"
                >
                  Go to Products Page ➔
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-400 rounded-2xl text-xs font-semibold flex items-center space-x-3">
                <XCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Supplier & Invoice Header Details */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-900/50">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase block flex items-center space-x-1">
                  <Building2 size={12} className="text-amber-500" />
                  <span>1. Supplier & Invoice Information</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Supplier Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <Building2 size={10} />
                      <span>Supplier / Vendor Name *</span>
                    </label>
                    <input 
                      type="text" 
                      name="supplierName"
                      value={headerData.supplierName}
                      onChange={handleHeaderChange}
                      placeholder="e.g. V-Guard / Sudarson Suppliers"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                      required
                    />
                  </div>

                  {/* Supplier Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <Phone size={10} />
                      <span>Supplier Phone / Contact</span>
                    </label>
                    <input 
                      type="tel" 
                      name="supplierPhone"
                      value={headerData.supplierPhone}
                      onChange={handleHeaderChange}
                      placeholder="e.g. 9845012345"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                    />
                  </div>

                  {/* Invoice / Reference Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <FileText size={10} />
                      <span>Invoice / Bill Reference No. *</span>
                    </label>
                    <input 
                      type="text" 
                      name="invoiceNo"
                      value={headerData.invoiceNo}
                      onChange={handleHeaderChange}
                      placeholder="e.g. PUR-2026-005"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                      required
                    />
                  </div>

                  {/* Purchase Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <Calendar size={10} />
                      <span>Purchase Date *</span>
                    </label>
                    <input 
                      type="date" 
                      name="date"
                      value={headerData.date}
                      onChange={handleHeaderChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                      required
                    />
                  </div>

                </div>
              </div>

              {/* Section 2: Multi-Item Purchase Line Items */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center space-x-1">
                    <Truck size={12} className="text-emerald-500" />
                    <span>2. Stock Items Inward (e.g. TRV-HOT 200 PRO + 5)</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                    {items.length} Product Item(s)
                  </span>
                </div>

                {/* Line Items Repeater List */}
                <div className="space-y-3">
                  {items.map((item, index) => {
                    return (
                      <div 
                        key={item.id}
                        className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3 transition-all"
                      >
                        {/* Item Index Tag */}
                        <div className="flex items-center justify-between sm:justify-start">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                            #{index + 1}
                          </span>
                          
                          {/* Mobile trash button */}
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(index)}
                              className="sm:hidden p-1 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Product Selector - CLEAN DROPDOWN NO PRICE CLUTTER */}
                        <div className="flex-1 min-w-[200px]">
                          <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Equipment Product *</label>
                          <select 
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                            required
                          >
                            <option value="">-- Choose Product (e.g. TRV-HOT 200 PRO) --</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.brand}) | Stock: {p.stock}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="w-full sm:w-28">
                          <label className="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400 block mb-1">Inward Qty *</label>
                          <input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            min="1"
                            placeholder="Qty"
                            className="w-full px-3 py-2 border border-amber-300 dark:border-amber-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white outline-none"
                            required
                          />
                        </div>

                        {/* Order Amount */}
                        <div className="w-full sm:w-36">
                          <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Total Amount (₹)</label>
                          <input 
                            type="number"
                            value={item.totalAmount}
                            onChange={(e) => handleItemChange(index, 'totalAmount', e.target.value)}
                            placeholder="Optional amount"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none"
                          />
                        </div>

                        {/* Desktop Remove Button */}
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(index)}
                            title="Remove line item"
                            className="hidden sm:flex p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors self-end mb-0.5"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Item Row Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all bg-white dark:bg-slate-900"
                  >
                    <Plus size={16} />
                    <span>+ Add Another Product Item</span>
                  </button>
                </div>

              </div>

              {/* Section 3: Payment Status & Notes */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-900/50">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase block">3. Payment Status & Remarks</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Payment Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Payment Status</label>
                    <select 
                      name="paymentStatus"
                      value={headerData.paymentStatus}
                      onChange={handleHeaderChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                    >
                      <option value="Paid">Paid (Full Payment)</option>
                      <option value="Pending">Pending / Vendor Due</option>
                      <option value="Partial">Partial Payment</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <CreditCard size={10} />
                      <span>Payment Method</span>
                    </label>
                    <select 
                      name="paymentMethod"
                      value={headerData.paymentMethod}
                      onChange={handleHeaderChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                    >
                      <option value="Net Banking">Net Banking / NEFT</option>
                      <option value="UPI">UPI / GPay / PhonePe</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Batch / Vendor Remarks</label>
                    <input 
                      type="text" 
                      name="notes"
                      value={headerData.notes}
                      onChange={handleHeaderChange}
                      placeholder="e.g. Inward batch containing TRV HOT 200 PRO + 5 units"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/25"
                    />
                  </div>

                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-amber-500/20 dark:shadow-none transition-all duration-150 flex items-center justify-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Record Inward & Add +{totalUnits} Stock to Products</span>
                </button>
              </div>

            </form>

          </div>
        </div>

        {/* Real-time Order Summary Card (Right Column) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-6">
            
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h4 className="font-display font-extrabold text-slate-800 dark:text-white text-sm">Products Catalog Stock Impact</h4>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-4">
              
              {/* Selected Items Breakdown List */}
              <div className="pt-2 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {items.filter(it => it.productId).length > 0 ? (
                  items.filter(it => it.productId).map((item, idx) => {
                    const prod = products.find(p => p.id === item.productId);
                    const qtyVal = parseInt(item.quantity) || 0;
                    const priceVal = parseFloat(item.totalAmount) || 0;
                    const currentStockVal = prod ? prod.stock : 0;
                    const projectedStockVal = currentStockVal + qtyVal;

                    return (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase">{prod?.brand}</span>
                            <h5 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100 leading-tight">{prod?.name}</h5>
                          </div>
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                            +{qtyVal} units
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-1.5">
                          <span>Products Stock: {currentStockVal} ➔ <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{projectedStockVal}</strong></span>
                          {priceVal > 0 && <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(priceVal)}</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-[11px] text-slate-400 font-semibold">
                    📦 Select an equipment product (e.g. TRV-HOT 200 PRO) to preview stock increase
                  </div>
                )}
              </div>

              {/* Order Calculations Breakdown */}
              <div className="pt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Selected Products</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{items.filter(it => it.productId).length} items</span>
                </div>

                <div className="flex justify-between">
                  <span>Inward Units Addition</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+{totalUnits} units</span>
                </div>
                
                {grandTotal > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex justify-between items-end">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Total Purchase Amount</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400 leading-none">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                )}
              </div>

              {/* Information Hint */}
              <div className="pt-4">
                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed font-medium">
                  ✅ <strong className="text-emerald-900 dark:text-emerald-300">Instant Products Page Update:</strong> Submitting adds stock directly to the Products catalog database table!
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Printable & Downloadable Purchase Report Sheet (Visible on Screen & PDF Print) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 print-card">
        
        {/* Printable Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <img src={logo} alt="SK Powertech Logo" className="w-8 h-8 object-contain bg-white p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm" />
              <span className="font-display font-black text-base text-slate-800 dark:text-white">S.K. Power Tech</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Stock Inward Purchase Ledger & Restock History</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 no-print">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search supplier, item or bill #..."
                className="pl-9 pr-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/25 w-full sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="All">All Payment Status</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending Only</option>
            </select>

            {/* Download PDF Button */}
            <button
              onClick={() => downloadPurchasePDF(filteredPurchases)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-sm"
              title="Download Purchase Report PDF"
            >
              <Download size={14} />
              <span>Download PDF Report</span>
            </button>

            {/* Download CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all"
              title="Export CSV Data"
            >
              <FileSpreadsheet size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          {filteredPurchases.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Date & Invoice</th>
                  <th className="py-3 px-3">Supplier Name</th>
                  <th className="py-3 px-3">Inward Items Breakdown</th>
                  <th className="py-3 px-3 text-center">Inward Units</th>
                  <th className="py-3 px-3 text-right">Total Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPurchases.map((p) => {
                  const isExpanded = expandedInvoiceId === p.id;
                  const itemList = p.items && p.items.length > 0 
                    ? p.items 
                    : [{ productName: p.productName || 'Equipment Item', quantity: p.quantity || 1, purchasePrice: p.purchasePrice || 0, totalAmount: p.totalAmount || 0 }];
                  
                  const totalUnitsCount = p.totalUnits || itemList.reduce((sum, i) => sum + (parseInt(i.quantity) || 0), 0);

                  return (
                    <React.Fragment key={p.id}>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{p.date}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.invoiceNo}</span>
                        </td>
                        
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{p.supplierName}</span>
                          {p.supplierPhone && <span className="text-[10px] text-slate-400">{p.supplierPhone}</span>}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {itemList.length === 1 ? itemList[0].productName : `${itemList.length} items (${itemList.map(i => `${i.productName} (+${i.quantity})`).join(', ')})`}
                            </span>
                            
                            {itemList.length > 1 && (
                              <button
                                onClick={() => setExpandedInvoiceId(isExpanded ? null : p.id)}
                                className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold flex items-center space-x-1 shrink-0 no-print"
                              >
                                <span>{isExpanded ? 'Hide' : 'Items'}</span>
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full font-black text-xs inline-block">
                            +{totalUnitsCount} units
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right font-black text-slate-900 dark:text-white text-sm">
                          {p.totalAmount > 0 ? formatCurrency(p.totalAmount) : '-'}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            p.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                          }`}>
                            {p.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right no-print">
                          <button
                            onClick={() => deletePurchase(p.id)}
                            title="Delete purchase log entry"
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Line Items Detail Row */}
                      {isExpanded && (
                        <tr className="bg-amber-50/30 dark:bg-slate-950/60">
                          <td colSpan="7" className="p-4">
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-amber-200 dark:border-amber-900/40 space-y-2">
                              <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                                Inward Line Items Details ({p.invoiceNo})
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {itemList.map((it, idx) => (
                                  <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{it.productName}</span>
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                      <span>Inward Stock: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">+{it.quantity} units</strong></span>
                                      {it.totalAmount > 0 && <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(it.totalAmount)}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
              <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto stroke-1" />
              <p>No purchase records found matching your filters.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default PurchasesView;
