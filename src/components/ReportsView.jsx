import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { formatCurrency, exportToCSV, getMonthYearString } from '../utils/helpers';
import { Calendar, Download, Printer, FileText, ArrowRight, ShieldCheck, Sun, Droplet, Zap, Battery } from 'lucide-react';

const ReportsView = () => {
  const { sales } = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState('2026-07'); // Default to target month

  // Filter sales by selected month
  const monthlySales = sales.filter(s => s.date && s.date.startsWith(selectedMonth));

  // Category aggregations
  const reportSummary = {
    'Solar Water Heater': { qty: 0, revenue: 0, profit: 0, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-950/20', icon: Sun },
    'Water Purifier': { qty: 0, revenue: 0, profit: 0, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/20', icon: Droplet },
    'UPS Inverter': { qty: 0, revenue: 0, profit: 0, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20', icon: Zap },
    'Batteries': { qty: 0, revenue: 0, profit: 0, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-950/20', icon: Battery }
  };

  monthlySales.forEach(s => {
    if (reportSummary[s.category]) {
      reportSummary[s.category].qty += s.quantity;
      reportSummary[s.category].revenue += s.totalAmount;
      reportSummary[s.category].profit += s.profitAmount;
    }
  });

  const totalRevenue = Object.values(reportSummary).reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = Object.values(reportSummary).reduce((acc, curr) => acc + curr.profit, 0);
  const totalSold = Object.values(reportSummary).reduce((acc, curr) => acc + curr.qty, 0);

  // Available months list from sales history to filter
  const uniqueMonths = Array.from(new Set(sales.map(s => s.date.substring(0, 7)))).sort().reverse();
  if (uniqueMonths.length === 0) {
    uniqueMonths.push('2026-07');
  }

  // Export report to CSV
  const handleExportCSV = () => {
    const headers = ['Category', 'Units Sold', 'Revenue (INR)', 'Net Margin (INR)'];
    const data = Object.entries(reportSummary).map(([category, stats]) => ({
      category,
      qty: stats.qty,
      revenue: stats.revenue,
      profit: stats.profit
    }));
    
    exportToCSV(
      `SK_Powertech_Report_${selectedMonth}`, 
      headers, 
      data, 
      (item) => [item.category, item.qty, item.revenue, item.profit]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Selection & Export toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm no-print">
        
        {/* Month Selector */}
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <div>
            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Report Period</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-0.5 border-none bg-transparent font-display font-extrabold text-sm text-slate-800 dark:text-white outline-none focus:ring-0 cursor-pointer"
            >
              {uniqueMonths.map(m => (
                <option key={m} value={m} className="dark:bg-slate-900 text-xs">
                  {getMonthYearString(`${m}-01`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors duration-150"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 dark:shadow-none transition-colors duration-150"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
        </div>

      </div>

      {/* Printable Report Layout Sheet */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm print-card">
        
        {/* Printable Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-base">SK</div>
              <span className="font-display font-black text-base text-slate-800 dark:text-white">SK Powertech Solutions</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Solar Systems, Water Purifiers & Backup UPS</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block">Monthly Statement</span>
            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
              {getMonthYearString(`${selectedMonth}-01`)} Report
            </h3>
          </div>
        </div>

        {/* Main Aggregation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
          {Object.entries(reportSummary).map(([catName, stats]) => {
            const Icon = stats.icon;
            return (
              <div 
                key={catName}
                className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${stats.bgColor}`}>
                      <Icon className={`w-4 h-4 ${stats.color}`} />
                    </div>
                    <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">{catName}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Total Sold</span>
                    <span className="text-slate-800 dark:text-white">{stats.qty} Units</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Total Revenue</span>
                    <span className="text-slate-800 dark:text-white font-bold">{formatCurrency(stats.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <span>Total Margin</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{formatCurrency(stats.profit)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ledger Summary and Sign-off */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Grand Statement Totals</span>
            <div className="flex items-baseline space-x-3">
              <h3 className="font-display font-extrabold text-2xl text-white">
                {formatCurrency(totalRevenue)}
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">({totalSold} Units Shipped)</span>
            </div>
            <p className="text-[10px] text-slate-400">Aggregated from {monthlySales.length} billing records</p>
          </div>
          
          <div className="sm:border-l sm:border-slate-800 sm:pl-6 text-left">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Gross Operating Profit</span>
            <h4 className="font-display font-extrabold text-xl text-emerald-400">
              {formatCurrency(totalProfit)}
            </h4>
            <span className="text-[10px] text-slate-400 font-semibold block">Avg Profit Margin: {totalRevenue ? Math.round((totalProfit / totalRevenue) * 100) : 0}%</span>
          </div>
        </div>

        {/* Transaction History Sub-table */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
            Transaction Ledger List ({monthlySales.length} entries)
          </h4>

          {monthlySales.length === 0 ? (
            <div className="py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400 font-medium">
              No transactions recorded during this calendar month.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="py-2">Date</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Equipment Category</th>
                    <th className="py-2 text-right">Units</th>
                    <th className="py-2 text-right">Total Invoice</th>
                    <th className="py-2 text-right">Total Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {monthlySales.map(sale => (
                    <tr key={sale.id} className="text-slate-600 dark:text-slate-300">
                      <td className="py-2.5 font-mono">{sale.date}</td>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-white">{sale.customerName}</td>
                      <td className="py-2.5">{sale.productName}</td>
                      <td className="py-2.5 text-right font-medium">{sale.quantity}</td>
                      <td className="py-2.5 text-right font-bold text-slate-800 dark:text-white">{formatCurrency(sale.totalAmount)}</td>
                      <td className="py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(sale.profitAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Verification footer */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Audited statement compiled by local storage browser engine.</span>
          </div>
          <span>Report generated at {new Date().toLocaleDateString('en-IN')}</span>
        </div>

      </div>

    </div>
  );
};

export default ReportsView;
