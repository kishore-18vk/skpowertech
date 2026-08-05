import React from 'react';
import { X, Printer, ShieldCheck, Mail, Phone, MapPin, CheckCircle2, AlertCircle, FileText, User } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import logo from '../assets/logo.jpeg';

const InvoiceModal = ({ sale, onClose }) => {
  if (!sale) return null;

  // Calculate invoice financials
  const total = parseFloat(sale.totalAmount) || 0;
  const paid = parseFloat(sale.amountPaid) || 0;
  const due = parseFloat(sale.dueAmount) || 0;
  const qty = parseInt(sale.quantity) || 1;
  const unitPrice = total / qty;

  const handlePrint = () => {
    document.body.classList.add('print-mode-invoice');
    window.print();
    // Use a short delay before removing class to let browser spawn print dialog
    setTimeout(() => {
      document.body.classList.remove('print-mode-invoice');
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
      
      {/* Card Wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl relative overflow-hidden invoice-print-wrapper animate-fade-in my-8">
        
        {/* Creative Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Controls (Hidden in print) */}
        <div className="no-print bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="font-display font-extrabold text-xs text-slate-850 dark:text-slate-200 uppercase tracking-widest">
              Tax Invoice Statement
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all duration-150 shadow-md shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-250 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Body (Printed) */}
        <div className="p-6 md:p-8 space-y-6 text-slate-800 dark:text-slate-250 bg-white dark:bg-slate-900 text-left relative">
          
          {/* Subtle Creative Background Watermark (on-screen only) */}
          <div className="absolute right-10 top-1/3 text-slate-100/35 dark:text-slate-800/10 pointer-events-none select-none font-display font-black text-7xl uppercase tracking-widest no-print -rotate-12 hidden md:block">
            S.K. POWER
          </div>

          {/* Header section */}
          <div className="flex flex-col md:flex-row md:justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-6 gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img src={logo} alt="SK Powertech Logo" className="w-12 h-12 object-contain bg-white p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                <div>
                  <h1 className="font-display font-black text-2xl tracking-wider text-slate-900 dark:text-white leading-none">
                    S.K. POWER TECH
                  </h1>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mt-1 block">
                    Solar Hot Water Systems & Purifiers
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 mt-4">
                <p className="flex items-start space-x-1.5">
                  <MapPin size={13} className="shrink-0 mt-0.5 text-indigo-500 dark:text-indigo-400" />
                  <span>2/304 A, Muthu Nagar, Mainroad, Poolakinar, Udumalpet - 642122, Tiruppur, Tamil Nadu, India</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Phone size={13} className="text-indigo-500 dark:text-indigo-400" />
                  <span>+91 93666 53164</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Mail size={13} className="text-indigo-500 dark:text-indigo-400" />
                  <span>skpowertechtup@gmail.com</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end w-full md:w-auto">
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850/80 p-4 rounded-2xl md:text-right space-y-1 w-full md:w-56 shadow-sm">
                <div className="flex items-center justify-between md:justify-end md:space-x-2">
                  <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">Status:</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${due === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'}`}>
                    {due === 0 ? 'Fully Settled' : 'Payment Pending'}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Invoice Number</span>
                  <span className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 font-mono">
                    INV-{sale.id.substring(5).toUpperCase()}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-850/50 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-450">
                  <span>Issue Date:</span>
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{sale.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50/15 dark:from-slate-950 dark:to-indigo-950/5 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center space-x-1.5 mb-2.5 border-b border-slate-100 dark:border-slate-850 pb-1.5">
                <User size={12} className="text-indigo-500" />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Billed To Customer</span>
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{sale.customerName}</h4>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 mt-2.5">
                {sale.customerPhone && (
                  <p className="flex items-center space-x-1.5">
                    <Phone size={11} className="text-slate-400 dark:text-slate-500" />
                    <span>{sale.customerPhone}</span>
                  </p>
                )}
                {sale.customerEmail && (
                  <p className="flex items-center space-x-1.5">
                    <Mail size={11} className="text-slate-400 dark:text-slate-500" />
                    <span className="break-all">{sale.customerEmail}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-purple-50/15 dark:from-slate-950 dark:to-purple-950/5 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center space-x-1.5 mb-2.5 border-b border-slate-100 dark:border-slate-850 pb-1.5">
                <MapPin size={12} className="text-purple-500" />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Installation Address</span>
              </div>
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
                {sale.customerAddress}
              </p>
            </div>
          </div>

          {/* Table of Items */}
          <div className="overflow-hidden border border-slate-150 dark:border-slate-850 rounded-2xl relative z-10">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-150 dark:border-slate-850 text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4 text-center w-16">Qty</th>
                  <th className="py-3 px-4 text-right w-28">Unit Rate</th>
                  <th className="py-3 px-4 text-right w-32">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                <tr className="text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-display font-semibold text-xs text-slate-900 dark:text-white block">{sale.productName}</span>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                        Category: {sale.category}
                      </span>
                      {sale.serialNumber && (
                        <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          Sr. No: {sale.serialNumber}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white font-mono">{sale.quantity}</td>
                  <td className="py-4 px-4 text-right font-mono">{formatCurrency(unitPrice)}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial summary & Service status blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 relative z-10">
            
            {/* Left side: Installation details tracker (NO warranty duration details) */}
            <div className="bg-slate-50/60 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Service & Installation</span>
                
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl shrink-0 ${sale.installationStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Delivery Status</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {sale.installationStatus} ({sale.installationDate})
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-850/50 pt-3">
                🌿 Professional installation certified by SK Powertech technical team. For product support or scheduling, please reach out to our service division.
              </div>
            </div>

            {/* Right side: Payment summary */}
            <div className="bg-slate-50/60 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-medium">Gross Total</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-medium">Amount Paid ({sale.paymentMethod})</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(paid)}</span>
              </div>
              
              <div className="border-t border-slate-200/80 dark:border-slate-800 pt-3 flex justify-between items-center">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Remaining Balance</span>
                <span className={`font-mono font-black text-sm px-3 py-1 rounded-xl shadow-sm ${due > 0 ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'}`}>
                  {formatCurrency(due)}
                </span>
              </div>
              
              {due === 0 ? (
                <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-xl text-[9px] font-extrabold justify-center uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  <span>Transaction Settled in Full</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-2 rounded-xl text-[9px] font-extrabold justify-center uppercase tracking-wider">
                  <AlertCircle size={12} />
                  <span>Partial Payment Balance Due</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] text-slate-400 leading-relaxed relative z-10">
            <div>
              <p className="font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5">Terms & Conditions</p>
              <ul className="list-disc list-inside space-y-1 text-slate-450 dark:text-slate-500">
                <li>Goods once sold will not be returned or exchanged.</li>
                <li>Manufacturer warranties (if applicable) are subject to brand policy.</li>
                <li>All disputes are subject to Tiruppur jurisdiction.</li>
              </ul>
            </div>
            
            <div className="text-center md:text-right flex flex-col items-center md:items-end justify-end">
              <div className="relative inline-block text-center mb-1">
                {/* Handwritten signature placeholder using system font fallbacks */}
                <div 
                  className="italic text-xl text-indigo-600/85 dark:text-indigo-400/85 select-none transform -rotate-3 tracking-widest px-4 py-1.5" 
                  style={{ fontFamily: "'Brush Script MT', 'Dancing Script', 'Caveat', 'Georgia', cursive" }}
                >
                  Suresh Kumar
                </div>
                <div className="h-0.5 border-b border-dashed border-slate-200 dark:border-slate-800 w-44" />
              </div>
              <span className="font-bold uppercase tracking-widest text-[8px] text-slate-500 dark:text-slate-400 mt-1 block">Authorized Signatory</span>
              <span className="text-[8px] text-slate-450 mt-0.5 block">For S.K. Power Tech</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
