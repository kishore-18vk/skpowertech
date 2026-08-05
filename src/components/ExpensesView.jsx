import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Calendar, 
  Search, 
  Building2, 
  Fuel, 
  Utensils, 
  FileText, 
  Users, 
  Wrench, 
  Zap, 
  Truck, 
  CheckCircle,
  X,
  Filter,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

const EXPENSE_CATEGORIES = [
  { name: 'Office Rent', subTypes: ['Mukkonam', 'Udumalai', 'Tirupur'], icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  { name: 'Fuel', subTypes: ['CNG', 'Petrol'], icon: Fuel, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { name: 'Food', subTypes: ['Daily Lunch & Tea', 'Staff Refreshments'], icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { name: 'Stationery', subTypes: ['Paper & Printing', 'Office Supplies', 'Bill Books'], icon: FileText, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30' },
  { name: 'Salary', subTypes: ['Staff Salary', 'Technician Advance'], icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  { name: 'Vehicle & Machine Service', subTypes: ['Eco Service', 'Unicorn Service', 'Ather Service'], icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  { name: 'EB Bill', subTypes: ['Total 3 Office', 'Main Branch', 'Store'], icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
  { name: 'Transport & Logistics', subTypes: ['Transport', 'Courier', 'Bus Courier'], icon: Truck, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30' },
];

const ExpensesView = () => {
  const { expenses, addExpense, deleteExpense, clearAllExpenses } = useContext(AppContext);

  // Time & Filter states
  const [timeFilter, setTimeFilter] = useState('ALL'); // 'TODAY', 'WEEK', 'MONTH', 'ALL'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  
  // Form fields
  const [expCategory, setExpCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [expSubType, setExpSubType] = useState(EXPENSE_CATEGORIES[0].subTypes[0]);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [expNotes, setExpNotes] = useState('');

  // When category changes, update default subType
  const handleCategoryChange = (catName) => {
    setExpCategory(catName);
    const catObj = EXPENSE_CATEGORIES.find(c => c.name === catName);
    if (catObj && catObj.subTypes.length > 0) {
      setExpSubType(catObj.subTypes[0]);
    } else {
      setExpSubType('');
    }
  };

  // Open add modal prefilled for a category card
  const handleQuickAdd = (categoryName, subType = '') => {
    handleCategoryChange(categoryName);
    if (subType) setExpSubType(subType);
    setExpTitle(subType ? `${categoryName} - ${subType}` : categoryName);
    setExpAmount('');
    setExpDate(new Date().toISOString().substring(0, 10));
    setExpNotes('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(expAmount);
    if (isNaN(amountVal) || amountVal < 0) {
      alert("Please enter a valid amount");
      return;
    }

    const titleText = expTitle.trim() || `${expCategory} ${expSubType ? `(${expSubType})` : ''}`;

    addExpense({
      date: expDate,
      category: expCategory,
      subCategory: expSubType,
      title: titleText,
      amount: amountVal,
      notes: expNotes.trim()
    });

    setNotifMsg(`✅ Added expense: ${titleText} (₹${amountVal.toLocaleString('en-IN')})`);
    setTimeout(() => setNotifMsg(''), 4000);

    setIsAddOpen(false);
    setExpAmount('');
    setExpTitle('');
    setExpNotes('');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete expense "${title}"?`)) {
      deleteExpense(id);
      setNotifMsg(`🗑️ Expense deleted.`);
      setTimeout(() => setNotifMsg(''), 4000);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("⚠️ ARE YOU SURE YOU WANT TO CLEAR ALL EXPENSE DATA? This will permanently erase all expense records. This action cannot be undone.")) {
      clearAllExpenses();
      setNotifMsg("🗑️ All expense data cleared.");
      setTimeout(() => setNotifMsg(''), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Date filtering logic
  const now = new Date();
  const todayStr = now.toISOString().substring(0, 10);
  
  // Calculate start of current week (Monday)
  const dayOfWeek = now.getDay() || 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
  const startOfWeekStr = startOfWeek.toISOString().substring(0, 10);

  const startOfMonthStr = now.toISOString().substring(0, 7);

  const filteredExpenses = expenses.filter(exp => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = exp.title?.toLowerCase().includes(q);
      const matchCat = exp.category?.toLowerCase().includes(q);
      const matchSub = exp.subCategory?.toLowerCase().includes(q);
      const matchNotes = exp.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchSub && !matchNotes) return false;
    }

    // Category filter
    if (categoryFilter !== 'ALL' && exp.category !== categoryFilter) {
      return false;
    }

    // Time filter
    if (timeFilter === 'TODAY') {
      return exp.date === todayStr;
    }
    if (timeFilter === 'WEEK') {
      return exp.date >= startOfWeekStr && exp.date <= todayStr;
    }
    if (timeFilter === 'MONTH') {
      return exp.date && exp.date.startsWith(startOfMonthStr);
    }
    return true; // 'ALL' - includes multi-month (e.g. 2 months or more)
  });

  // Calculate totals
  const grandTotal = filteredExpenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const categoryTotals = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat.name] = filteredExpenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Notification banner */}
      {notifMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm no-print">
          <span>{notifMsg}</span>
          <button onClick={() => setNotifMsg('')} className="text-emerald-500 hover:text-emerald-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Header & Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm no-print">
        
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg md:text-xl text-slate-800 dark:text-white">Expense Tracker & Ledger</h1>
            <p className="text-xs text-slate-400">Track Office Rent, Fuel, Service Charges, Salaries & EB Bills</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 dark:shadow-none transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Enter Expense</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Clear old / accumulated expense data"
          >
            <RotateCcw size={14} />
            <span>Clear Expenses</span>
          </button>

        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        
        {/* Time Filter Pills */}
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          {[
            { id: 'ALL', label: 'All / Multi-Month' },
            { id: 'TODAY', label: 'Daily (Today)' },
            { id: 'WEEK', label: 'Weekly' },
            { id: 'MONTH', label: 'Monthly' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeFilter === tab.id
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center space-x-2">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-purple-500 w-40 sm:w-56"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

        </div>

      </div>

      {/* Summary Stat Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 no-print">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-300">Total Operational Expenditure</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-1">
            {formatCurrency(grandTotal)}
          </h2>
          <p className="text-xs text-purple-200/80 mt-1">
            Calculated from {filteredExpenses.length} expense log entries ({timeFilter === 'ALL' ? 'Multi-month total' : timeFilter.toLowerCase()})
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
          <div className="text-right">
            <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">Office Rent & Fuel Total</span>
            <span className="font-display font-extrabold text-lg text-white">
              {formatCurrency((categoryTotals['Office Rent'] || 0) + (categoryTotals['Fuel'] || 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {EXPENSE_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const totalAmt = categoryTotals[cat.name] || 0;
          return (
            <div 
              key={cat.name} 
              className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-xl ${cat.bg}`}>
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">{cat.name}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Recorded Spending</span>
                  <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white block mt-0.5">
                    {formatCurrency(totalAmt)}
                  </span>
                </div>

                {/* Subtype tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {cat.subTypes.map(st => (
                    <button
                      key={st}
                      onClick={() => handleQuickAdd(cat.name, st)}
                      className="text-[9px] font-semibold bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      title={`Add entry for ${st}`}
                    >
                      + {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleQuickAdd(cat.name)}
                className="mt-4 w-full py-1.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-800/50 dark:hover:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-slate-200/60 dark:border-slate-800 rounded-xl text-[11px] font-bold transition-colors cursor-pointer text-center block"
              >
                Enter Amount
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Expense Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm no-print">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
            Itemized Expense Entries ({filteredExpenses.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Click trash icon to remove any entry</span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium space-y-2">
            <p>No expense entries found for the selected filter.</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
            >
              + Add a new expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Title / Sub-type</th>
                  <th className="py-3 px-3">Notes / Remarks</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{exp.title}</span>
                      {exp.subCategory && <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block">{exp.subCategory}</span>}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      {exp.notes || '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(exp.id, exp.title)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Delete expense entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable PDF Sheet (Visible during window.print()) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm print-card">
        
        {/* Print Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2.5">
              <img src={logo} alt="SK Powertech Logo" className="w-8 h-8 object-contain bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm" />
              <span className="font-display font-black text-lg text-slate-900">S.K. Power Tech</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Solar Systems, Water Purifiers, Inverters & Battery Solutions</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block">Operational Expense Statement</span>
            <h3 className="font-display font-extrabold text-base text-slate-900 mt-0.5">
              {timeFilter === 'ALL' ? 'Total Multi-Month Statement' : `${timeFilter} Expense Statement`}
            </h3>
            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Generated: {new Date().toLocaleDateString('en-IN')}</span>
          </div>
        </div>

        {/* Print Summary Banner */}
        <div className="my-6 p-4 bg-slate-950 text-white rounded-2xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider block">Grand Total Spending</span>
            <h3 className="font-display font-extrabold text-2xl text-white mt-0.5">{formatCurrency(grandTotal)}</h3>
          </div>
          <div className="text-right text-xs">
            <span className="block text-slate-300">Total Entries: <strong>{filteredExpenses.length}</strong></span>
            <span className="block text-slate-400 text-[10px] mt-0.5">Period: {timeFilter === 'ALL' ? 'Accumulated Multi-Month' : timeFilter}</span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="my-6">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">Category Summary</h4>
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-2">Category Name</th>
                <th className="p-2 text-right">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {EXPENSE_CATEGORIES.map(cat => {
                const amt = categoryTotals[cat.name] || 0;
                return (
                  <tr key={cat.name}>
                    <td className="p-2 font-semibold text-slate-800">{cat.name}</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">{formatCurrency(amt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Itemized Table for PDF */}
        <div className="mt-6">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">Itemized Expense Ledger</h4>
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-2">Date</th>
                <th className="p-2">Category</th>
                <th className="p-2">Title / Sub-type</th>
                <th className="p-2">Notes</th>
                <th className="p-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {filteredExpenses.map(e => (
                <tr key={e.id}>
                  <td className="p-2 text-slate-600">{e.date}</td>
                  <td className="p-2 font-sans font-medium text-slate-800">{e.category}</td>
                  <td className="p-2 font-sans font-bold text-slate-900">{e.title}</td>
                  <td className="p-2 font-sans text-slate-500">{e.notes || '-'}</td>
                  <td className="p-2 text-right font-bold text-slate-900">{formatCurrency(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="h-10 border-b border-slate-300 mx-auto max-w-[180px]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase block mt-2">Prepared By</span>
            <span className="font-semibold text-slate-800">Accounts Lead</span>
          </div>
          <div>
            <div className="h-10 border-b border-slate-300 mx-auto max-w-[180px]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase block mt-2">Authorized Approval</span>
            <span className="font-semibold text-slate-800">S.K. Power Tech</span>
          </div>
        </div>

      </div>

      {/* Add Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scale-up">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Wallet size={20} />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-white">Enter New Expense</h3>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
              
              {/* Category selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Expense Category
                </label>
                <select
                  value={expCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* SubType dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Sub-Type / Location / Vehicle
                </label>
                <select
                  value={expSubType}
                  onChange={(e) => {
                    setExpSubType(e.target.value);
                    if (!expTitle || expTitle.includes(expCategory)) {
                      setExpTitle(`${expCategory} - ${e.target.value}`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {(EXPENSE_CATEGORIES.find(c => c.name === expCategory)?.subTypes || []).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Title input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mukkonam Rent / CNG Refill"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  min="0"
                  step="any"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              {/* Notes Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Notes / Bill Ref (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid via UPI / Bill #104"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 dark:shadow-none cursor-pointer"
                >
                  Save Expense
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ExpensesView;
