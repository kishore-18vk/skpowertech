import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { ShoppingCart, User, Phone, MapPin, Calendar, CheckCircle2, XCircle, Calculator, Tag, Mail, CreditCard } from 'lucide-react';

const SalesView = () => {
  const { products, addSale, setActiveTab } = useContext(AppContext);

  // Form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerEmail: '',
    customerGstin: '',
    productId: '',
    quantity: '1',
    totalAmount: '',
    amountPaid: '',
    dueAmount: '0',
    date: '2026-07-11',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    installationDate: '2026-07-12'
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update selected product reference when productId changes
  useEffect(() => {
    if (formData.productId) {
      const prod = products.find(p => p.id === formData.productId);
      if (prod) {
        setSelectedProduct(prod);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'totalAmount') {
        const total = parseFloat(value) || 0;
        const paid = prev.paymentStatus === 'Paid' ? total : (parseFloat(prev.amountPaid) || 0);
        updated.amountPaid = paid.toString();
        updated.dueAmount = (total - paid).toString();
      } else if (name === 'amountPaid') {
        const total = parseFloat(prev.totalAmount) || 0;
        const paid = parseFloat(value) || 0;
        updated.dueAmount = (total - paid).toString();
      } else if (name === 'paymentStatus') {
        const total = parseFloat(prev.totalAmount) || 0;
        const paid = value === 'Paid' ? total : 0;
        updated.amountPaid = paid.toString();
        updated.dueAmount = (total - paid).toString();
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress || !formData.productId || !formData.quantity || !formData.totalAmount || !formData.date) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (parseInt(formData.quantity) <= 0) {
      setErrorMessage("Quantity must be greater than zero.");
      return;
    }

    if (!selectedProduct) {
      setErrorMessage("Please select a valid product.");
      return;
    }

    if (selectedProduct.stock < parseInt(formData.quantity)) {
      setErrorMessage(`Insufficient stock. Only ${selectedProduct.stock} unit(s) available.`);
      return;
    }

    // Call state action
    const result = addSale(formData);

    if (result.success) {
      setSuccessMessage("Sale successfully recorded! Redirecting to Sales Report...");
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        customerEmail: '',
        customerGstin: '',
        productId: '',
        quantity: '1',
        totalAmount: '',
        amountPaid: '',
        dueAmount: '0',
        date: '2026-07-11',
        paymentStatus: 'Paid',
        paymentMethod: 'Cash',
        installationDate: '2026-07-12'
      });
      
      // Redirect after 1s
      setTimeout(() => {
        setSuccessMessage('');
        setActiveTab('reports');
      }, 1000);
    } else {
      setErrorMessage(result.error || "Failed to record sale.");
    }
  };

  // Calculations
  const qty = parseInt(formData.quantity) || 0;
  const subtotal = parseFloat(formData.totalAmount) || 0;
  const unitPrice = qty > 0 ? subtotal / qty : 0;
  
  const estimatedProfit = selectedProduct 
    ? subtotal - (selectedProduct.purchasePrice * qty) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-left">
      
      {/* Sales Form (Left panel, spans 2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          
          <div className="flex items-center space-x-2.5 mb-6">
            <ShoppingCart className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-display font-extrabold text-slate-800 dark:text-white text-base">New Customer Invoice Entry</h3>
              <p className="text-xs text-slate-400">Record sales orders and schedule installations instantly.</p>
            </div>
          </div>

          {/* Feedback alerts */}
          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Customer Details */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-900/50">
              <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase block">1. Customer Information</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <User size={10} />
                    <span>Customer Name *</span>
                  </label>
                  <input 
                    type="text" 
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <Phone size={10} />
                    <span>Phone Number *</span>
                  </label>
                  <input 
                    type="tel" 
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    maxLength="10"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <Mail size={10} />
                    <span>Email Address</span>
                  </label>
                  <input 
                    type="email" 
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="e.g. customer@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <Tag size={10} />
                    <span>GSTIN (Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    name="customerGstin"
                    value={formData.customerGstin}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, customerGstin: e.target.value.toUpperCase() }));
                    }}
                    placeholder="e.g. 29AAAAA1111A1Z1"
                    maxLength="15"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <MapPin size={10} />
                    <span>Billing & Delivery Address *</span>
                  </label>
                  <textarea 
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    placeholder="Provide detailed address for shipment and technicians..."
                    rows="2"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Product and pricing details */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-900/50">
              <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase block">2. Invoiced Items & Terms</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Select */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Select Equipment *</label>
                  <select 
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  >
                    <option value="">-- Choose Product from Stock --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} disabled={p.stock === 0}>
                        {p.name} ({p.brand} - {p.model}) | Stock: {p.stock}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Quantity Sold *</label>
                  <input 
                    type="number" 
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Total Sale Amount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Total Sale Amount (₹) *</label>
                  <input 
                    type="number" 
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Sale Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <Calendar size={10} />
                    <span>Transaction Date *</span>
                  </label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                    required
                  />
                </div>

                {/* Payment Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Payment Status *</label>
                  <select 
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Amount Paid */}
                {formData.paymentStatus === 'Pending' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Amount Paid (₹) *</label>
                    <input 
                      type="number" 
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                      required
                    />
                  </div>
                )}

                {/* Remaining Due Amount */}
                {formData.paymentStatus === 'Pending' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Remaining Due Amount (₹)</label>
                    <input 
                      type="number" 
                      name="dueAmount"
                      value={formData.dueAmount}
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2.5 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 font-bold outline-none select-none"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <CreditCard size={10} className="text-slate-450" />
                    <span>Payment Method *</span>
                  </label>
                  <select 
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                {/* Conditional Solar Installation Date */}
                {selectedProduct && selectedProduct.category === 'Solar Water Heater' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <Calendar size={10} className="text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Installation Date *</span>
                    </label>
                    <input 
                      type="date" 
                      name="installationDate"
                      value={formData.installationDate}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-emerald-200 dark:border-emerald-900 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                      required
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Form submit */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all duration-150"
              >
                Generate Invoice & Deduct Stock
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Bill summary (Right panel) */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="w-5 h-5 text-indigo-500" />
            <h4 className="font-display font-extrabold text-slate-800 dark:text-white text-sm">Real-time Bill Calculator</h4>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-4">
            
            {/* Product description preview */}
            <div className="pt-2">
              {selectedProduct ? (
                <div className="flex items-start space-x-3">
                  <img src={selectedProduct.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{selectedProduct.brand}</span>
                    <h5 className="font-display font-semibold text-xs text-slate-800 dark:text-slate-200 leading-tight">{selectedProduct.name}</h5>
                    <div className="flex items-center space-x-1.5 mt-1 text-[9px]">
                      <span className="text-slate-400 font-medium">Buying: {formatCurrency(selectedProduct.purchasePrice)}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-400 font-medium">Stock: {selectedProduct.stock} left</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-[10px] text-slate-400 font-semibold uppercase">
                  Select a product to view catalog properties
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Quantity</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">x {qty}</span>
              </div>
              <div className="flex justify-between">
                <span>Unit Rate</span>
                <span className="font-semibold">{formatCurrency(unitPrice)}</span>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex justify-between items-end">
                <span className="font-bold text-slate-700 dark:text-slate-300">Grand Total Amount</span>
                <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Profitability indicators */}
            <div className="pt-4">
              <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-950/50">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Expected Profit Valuation</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">
                    {formatCurrency(estimatedProfit)} Net
                  </span>
                  {selectedProduct && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      +{Math.round((estimatedProfit / (subtotal || 1)) * 100)}% margin
                    </span>
                  )}
                </div>
              </div>

              {selectedProduct && selectedProduct.category === 'Solar Water Heater' && (
                <div className="mt-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/30 text-[10px] text-emerald-800 dark:text-emerald-400 leading-normal font-semibold">
                  🌿 Solar Water Heater category includes automatic creation of technical installation orders.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default SalesView;
