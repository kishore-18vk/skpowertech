import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { 
  TrendingUp, 
  Package, 
  Layers, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  Zap, 
  Droplet, 
  Sun,
  Battery,
  Plus,
  FileText,
  Boxes,
  Percent,
  Calendar,
  Users
} from 'lucide-react';

const DashboardView = () => {
  const { products, sales, setActiveTab } = useContext(AppContext);
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // 1. KPI Calculations
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
  
  // Today's Date is static target '2026-07-11' for consistency
  const todayDateStr = '2026-07-11';
  const todaySales = sales.filter(s => s.date === todayDateStr);
  const todaySalesQty = todaySales.reduce((acc, curr) => acc + curr.quantity, 0);

  // July 2026 current month statistics
  const julySales = sales.filter(s => s.date && s.date.startsWith('2026-07'));
  const julyRevenue = julySales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const julyProfit = julySales.reduce((acc, curr) => acc + curr.profitAmount, 0);

  // Low Stock products
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const lowStockCount = lowStockProducts.length;

  // 2. Best-Selling Products calculation (Top 3)
  const productSalesMap = {};
  sales.forEach(s => {
    productSalesMap[s.productName] = (productSalesMap[s.productName] || 0) + s.quantity;
  });
  const bestSellers = Object.entries(productSalesMap)
    .map(([name, qty]) => {
      // Find corresponding product for brand details if possible
      const prod = products.find(p => p.name === name);
      return {
        name,
        qty,
        brand: prod ? prod.brand : 'SK Powertech',
        category: prod ? prod.category : 'Equipment'
      };
    })
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  // 3. Category Sales distribution configuration (with specific colors)
  const categorySales = {
    'Solar Water Heater': { revenue: 0, count: 0, color: '#10b981', hoverColor: '#059669', icon: Sun },
    'Water Purifier': { revenue: 0, count: 0, color: '#3b82f6', hoverColor: '#1d4ed8', icon: Droplet },
    'UPS Inverter': { revenue: 0, count: 0, color: '#f97316', hoverColor: '#c2410c', icon: Zap },
    'Batteries': { revenue: 0, count: 0, color: '#eab308', hoverColor: '#a16207', icon: Battery }
  };
  sales.forEach(s => {
    if (categorySales[s.category]) {
      categorySales[s.category].revenue += s.totalAmount;
      categorySales[s.category].count += s.quantity;
    }
  });

  const totalCatRevenue = Object.values(categorySales).reduce((acc, curr) => acc + curr.revenue, 0) || 1;
  
  // Donut chart stroke configurations
  let cumulativePercent = 0;
  const donutSlices = Object.entries(categorySales).map(([name, cat]) => {
    const percentage = cat.revenue / totalCatRevenue;
    const strokeDashoffset = 314.16 - (314.16 * percentage);
    const rotation = (cumulativePercent * 360) - 90;
    cumulativePercent += percentage;
    return {
      name,
      percentage,
      strokeDashoffset,
      rotation,
      color: cat.color,
      hoverColor: cat.hoverColor,
      revenue: cat.revenue,
      icon: cat.icon
    };
  });

  // 4. Sales Overview: Monthly revenue/profit trends from January to July
  const monthsList = [
    { key: '2026-01', label: 'Jan' },
    { key: '2026-02', label: 'Feb' },
    { key: '2026-03', label: 'Mar' },
    { key: '2026-04', label: 'Apr' },
    { key: '2026-05', label: 'May' },
    { key: '2026-06', label: 'Jun' },
    { key: '2026-07', label: 'Jul' }
  ];

  const chartData = monthsList.map(m => {
    const monthSales = sales.filter(s => s.date && s.date.startsWith(m.key));
    const revenue = monthSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const profit = monthSales.reduce((acc, curr) => acc + curr.profitAmount, 0);
    return {
      label: m.label,
      revenue,
      profit
    };
  });

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 100000);
  const chartHeight = 240;
  const chartWidth = 600;
  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 30;
  const paddingBottom = 35;

  const getX = (index) => {
    return paddingLeft + (index * (chartWidth - paddingLeft - paddingRight)) / (chartData.length - 1);
  };

  const getY = (value) => {
    return chartHeight - paddingBottom - (value * (chartHeight - paddingTop - paddingBottom)) / maxRevenue;
  };

  const points = chartData.map((d, i) => ({
    x: getX(i),
    y: getY(d.revenue),
    profitY: getY(d.profit),
    label: d.label,
    revenue: d.revenue,
    profit: d.profit
  }));

  const revenuePathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') 
    : '';

  const revenueAreaD = points.length > 0
    ? `${revenuePathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
    : '';

  const profitPathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].profitY} ` + points.slice(1).map(p => `L ${p.x} ${p.profitY}`).join(' ') 
    : '';

  const profitAreaD = points.length > 0
    ? `${profitPathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
    : '';

  // 5. Category stock calculations
  const getCategoryStockSum = (categoryName) => {
    return products.filter(p => p.category === categoryName).reduce((acc, curr) => acc + curr.stock, 0);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Executive Dashboard</span>
            <h2 className="font-display font-extrabold text-xl md:text-2xl text-white">SK Powertech Solutions</h2>
            <p className="text-xs text-slate-400 font-medium">Real-time overview of Solar Energy systems, RO Purifiers, and Power backup networks.</p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Local Engine</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 justify-end">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>Online Database</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* KPI: Total Products */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Total Products</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
              <Package size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-none">
              {totalProducts}
            </h3>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">Catalog items</span>
          </div>
        </div>

        {/* KPI: Total Stock */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Total Stock</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-500 dark:text-sky-400 flex items-center justify-center">
              <Layers size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-none">
              {totalStock}
            </h3>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">Units in warehouse</span>
          </div>
        </div>

        {/* KPI: Today's Sales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Today's Sales</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <ShoppingCart size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-none">
              {todaySalesQty} <span className="text-[10px] font-normal text-slate-400">Qty</span>
            </h3>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">Sold today ({todaySales.length} bills)</span>
          </div>
        </div>

        {/* KPI: Monthly Sales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Monthly Sales</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none truncate" title={formatCurrency(julyRevenue)}>
              {formatCurrency(julyRevenue)}
            </h3>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">July revenue</span>
          </div>
        </div>

        {/* KPI: Monthly Profit */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Monthly Profit</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-500 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-base sm:text-lg font-black text-emerald-650 dark:text-emerald-400 leading-none truncate" title={formatCurrency(julyProfit)}>
              {formatCurrency(julyProfit)}
            </h3>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">Margin profits</span>
          </div>
        </div>

        {/* KPI: Low Stock Alerts */}
        <div className={`border rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-205 flex flex-col justify-between ${
          lowStockCount > 0 
            ? 'bg-rose-50/45 dark:bg-rose-950/10 border-rose-205 dark:border-rose-900/40' 
            : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">Low Stock Alert</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              lowStockCount > 0 
                ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-455 animate-pulse' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-550'
            }`}>
              <AlertTriangle size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-lg sm:text-xl font-extrabold leading-none ${lowStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              {lowStockCount}
            </h3>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">Products to re-order</span>
          </div>
        </div>

      </div>

      {/* Sales Overview Chart (Line/Area Graph) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <span>Sales & Profit Overview</span>
            </h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">Tracking month-on-month revenue scaling and profit growth</span>
          </div>
          <div className="flex items-center space-x-4 text-[10px] font-bold">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
              <span className="text-slate-550 dark:text-slate-400">Revenue (₹)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span className="text-slate-550 dark:text-slate-400">Profit Margins (₹)</span>
            </span>
          </div>
        </div>

        {/* SVG Area Chart Container */}
        <div className="relative mt-6 w-full h-[260px]">
          <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity="0.25"/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity="0.00"/>
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity="0.25"/>
                <stop offset="95%" stopColor="#10b981" stopOpacity="0.00"/>
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = paddingTop + r * (chartHeight - paddingTop - paddingBottom);
              const gridVal = Math.round(maxRevenue * (1 - r));
              return (
                <g key={i} className="opacity-40">
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={chartWidth - paddingRight} 
                    y2={y} 
                    stroke="#e2e8f0" 
                    strokeDasharray="4 4" 
                    className="dark:stroke-slate-800"
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={y + 3} 
                    textAnchor="end" 
                    fontSize="9" 
                    className="fill-slate-400 font-bold"
                  >
                    ₹{(gridVal >= 100000) ? (gridVal / 100000).toFixed(1) + 'L' : (gridVal / 1000).toFixed(0) + 'k'}
                  </text>
                </g>
              );
            })}

            {/* Area gradients */}
            {revenueAreaD && <path d={revenueAreaD} fill="url(#revenueGradient)" />}
            {profitAreaD && <path d={profitAreaD} fill="url(#profitGradient)" />}

            {/* Lines */}
            {revenuePathD && <path d={revenuePathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />}
            {profitPathD && <path d={profitPathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />}

            {/* Interaction Column Bars */}
            {points.map((p, i) => (
              <g key={`data-${i}`}>
                {/* Revenue point */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={hoveredChartIndex === i ? 6 : 4} 
                  fill="#6366f1" 
                  stroke="white" 
                  strokeWidth="2" 
                  className="transition-all duration-150"
                />
                
                {/* Profit point */}
                <circle 
                  cx={p.x} 
                  cy={p.profitY} 
                  r={hoveredChartIndex === i ? 6 : 4} 
                  fill="#10b981" 
                  stroke="white" 
                  strokeWidth="2" 
                  className="transition-all duration-150"
                />

                {/* X Axis label */}
                <text 
                  x={p.x} 
                  y={chartHeight - 10} 
                  textAnchor="middle" 
                  fontSize="10" 
                  className={`font-semibold transition-colors duration-150 ${hoveredChartIndex === i ? 'fill-indigo-500 font-extrabold' : 'fill-slate-400'}`}
                >
                  {p.label}
                </text>

                {/* Transparent hover detector column */}
                <rect 
                  x={p.x - 25}
                  y={paddingTop}
                  width="50"
                  height={chartHeight - paddingTop - paddingBottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredChartIndex(i)}
                  onMouseLeave={() => setHoveredChartIndex(null)}
                />
              </g>
            ))}
          </svg>

          {/* Interactive Hover Tooltip details */}
          {hoveredChartIndex !== null && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950 text-white rounded-xl p-3 text-xs shadow-2xl border border-slate-800 z-20 flex space-x-4 animate-fade-in">
              <div>
                <span className="text-[8px] text-slate-400 font-black block uppercase tracking-wider">{monthsList[hoveredChartIndex].label} 2026</span>
                <span className="text-indigo-400 font-extrabold block mt-0.5">Rev: {formatCurrency(chartData[hoveredChartIndex].revenue)}</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[8px] text-slate-400 font-black block uppercase tracking-wider">Gross Profit</span>
                <span className="text-emerald-400 font-extrabold block mt-0.5">Net: {formatCurrency(chartData[hoveredChartIndex].profit)}</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Main Grid content: Category sales & Best Sellers & Inventory status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Sales Distribution Donut */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Boxes className="w-4.5 h-4.5 text-indigo-500" />
              <span>Category Sales Share</span>
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Revenue distribution across product segments</span>
          </div>

          <div className="relative my-6 flex items-center justify-center h-40">
            {/* SVG Donut */}
            <div className="relative w-40 h-40">
              <svg width="100%" height="100%" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="18" className="dark:stroke-slate-800/80" />
                {donutSlices.map((slice, idx) => (
                  <circle
                    key={slice.name}
                    cx="80"
                    cy="80"
                    r="50"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={hoveredSlice === idx ? "21" : "18"}
                    strokeDasharray="314.16"
                    strokeDashoffset={slice.strokeDashoffset}
                    transform={`rotate(${slice.rotation} 80 80)`}
                    strokeLinecap={slice.percentage > 0.03 ? "round" : "butt"}
                    className="transition-all duration-300 ease-out cursor-pointer"
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                ))}
              </svg>
              
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Total Value</span>
                <span className="text-xs font-black text-slate-850 dark:text-white mt-1 leading-none">
                  {formatCurrency(totalCatRevenue)}
                </span>
              </div>
            </div>

            {/* Hover slice helper box */}
            {hoveredSlice !== null && (
              <div className="absolute bottom-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow border border-slate-800">
                <span className="font-bold">{donutSlices[hoveredSlice].name}: </span>
                <span className="font-extrabold text-indigo-400">{Math.round(donutSlices[hoveredSlice].percentage * 100)}%</span>
              </div>
            )}
          </div>

          {/* Legend and stats */}
          <div className="space-y-2 pt-3 border-t border-slate-50 dark:border-slate-800/50">
            {donutSlices.map((slice) => {
              const Icon = slice.icon;
              return (
                <div key={slice.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: slice.color }} />
                    <Icon size={12} className="text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{slice.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white block">{formatCurrency(slice.revenue)}</span>
                    <span className="text-[9px] text-slate-400 font-bold block">{Math.round(slice.percentage * 100)}% share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
              <span>Best Selling Products</span>
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Top performing catalog items by volume</span>
          </div>

          <div className="flex-1 my-6 space-y-4">
            {bestSellers.length === 0 ? (
              <div className="h-full flex items-center justify-center py-8 text-center text-xs text-slate-400 uppercase font-semibold">
                No orders recorded
              </div>
            ) : (
              bestSellers.map((prod, index) => {
                const rankColors = [
                  'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900', // Gold
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200', // Silver
                  'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-900' // Bronze
                ];
                return (
                  <div 
                    key={prod.name} 
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl hover:-translate-y-0.5 transition-transform"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Rank badge */}
                      <span className={`w-6 h-6 rounded-xl border flex items-center justify-center text-xs font-black shrink-0 ${rankColors[index] || 'bg-slate-50 text-slate-500'}`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[8px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">{prod.brand} | {prod.category}</span>
                        <h5 className="font-display font-bold text-xs text-slate-850 dark:text-white truncate leading-tight mt-0.5" title={prod.name}>
                          {prod.name}
                        </h5>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block">{prod.qty} Units</span>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">Sold</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex justify-between items-center text-[10px] text-slate-400">
            <span>Sales figures compiled dynamically</span>
            <button onClick={() => setActiveTab('sales')} className="font-bold text-indigo-500 hover:underline">New Invoice</button>
          </div>
        </div>

        {/* Inventory Status (Stock Cards) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4.5 h-4.5 text-indigo-500" />
              <span>Inventory Status</span>
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Stock availability across normalized segments</span>
          </div>

          <div className="flex-1 my-6 space-y-3.5">
            {/* Solar Water Heater Card */}
            <div className="space-y-1">
              <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <Sun size={12} />
                  <span>Solar Water Heater</span>
                </span>
                <span className="font-black text-slate-905 dark:text-white">{getCategoryStockSum('Solar Water Heater')} Available</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                {/* relative progress, assume max capacity target 50 for visuals */}
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((getCategoryStockSum('Solar Water Heater') / 50) * 100, 100)}%` }} 
                />
              </div>
            </div>

            {/* Water Purifier Card */}
            <div className="space-y-1">
              <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-blue-650 dark:text-blue-400 flex items-center space-x-1">
                  <Droplet size={12} />
                  <span>Water Purifier</span>
                </span>
                <span className="font-black text-slate-905 dark:text-white">{getCategoryStockSum('Water Purifier')} Available</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((getCategoryStockSum('Water Purifier') / 50) * 100, 100)}%` }} 
                />
              </div>
            </div>

            {/* UPS Inverter Card */}
            <div className="space-y-1">
              <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center space-x-1">
                  <Zap size={12} />
                  <span>UPS Inverter</span>
                </span>
                <span className="font-black text-slate-905 dark:text-white">{getCategoryStockSum('UPS Inverter')} Available</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((getCategoryStockSum('UPS Inverter') / 30) * 100, 100)}%` }} 
                />
              </div>
            </div>

            {/* Batteries Card */}
            <div className="space-y-1">
              <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                  <Battery size={12} />
                  <span>Batteries</span>
                </span>
                <span className="font-black text-slate-905 dark:text-white">{getCategoryStockSum('Batteries')} Available</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((getCategoryStockSum('Batteries') / 40) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex justify-between items-center text-[10px] text-slate-400">
            <span>Critical low-stock items flagged in alert card</span>
            <button onClick={() => setActiveTab('products')} className="font-bold text-indigo-500 hover:underline">Update Stock</button>
          </div>
        </div>

      </div>

      {/* Recent Sales Table & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Sales Table (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Recent Sales</h3>
              <span className="text-[10px] text-slate-400 block mt-0.5">Most recent transaction ledger invoices</span>
            </div>
            <button onClick={() => setActiveTab('reports')} className="text-xs font-bold text-indigo-500 hover:underline">View Sales Ledger</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Customer Name</th>
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Amount</th>
                  <th className="py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-xs text-slate-450 uppercase font-semibold">
                      No sales records found.
                    </td>
                  </tr>
                ) : (
                  sales.slice(0, 5).map((sale) => (
                    <tr key={sale.id} className="text-xs hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-3 text-slate-450 dark:text-slate-500 font-mono">{formatDate(sale.date)}</td>
                      <td className="py-3 font-bold text-slate-850 dark:text-slate-205">{sale.customerName}</td>
                      <td className="py-3">
                        <span className="font-semibold block text-slate-700 dark:text-slate-300 truncate max-w-[140px] sm:max-w-none">{sale.productName}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{sale.category}</span>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-800 dark:text-slate-300">{sale.quantity}</td>
                      <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                        {formatCurrency(sale.totalAmount)}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`
                          px-2 py-0.5 rounded-full text-[9px] font-bold inline-block
                          ${sale.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'}
                        `}>
                          {sale.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Quick Actions</h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">Instant operations and navigation</span>
          </div>

          <div className="flex-1 my-6 flex flex-col justify-center space-y-3">
            {/* Add Product Action */}
            <button 
              onClick={() => setActiveTab('products')} 
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-705 text-white rounded-2xl shadow-sm hover:shadow-indigo-100 hover:shadow-md dark:shadow-none hover:-translate-y-0.5 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">Add Product</span>
                  <span className="text-[9px] text-indigo-100 block mt-0.5">Register items in catalog</span>
                </div>
              </div>
              <ArrowUpRight size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Add Sale Action */}
            <button 
              onClick={() => setActiveTab('sales')} 
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-705 text-white rounded-2xl shadow-sm hover:shadow-emerald-100 hover:shadow-md dark:shadow-none hover:-translate-y-0.5 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShoppingCart size={14} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">Add Sale</span>
                  <span className="text-[9px] text-emerald-100 block mt-0.5">Generate new invoice bill</span>
                </div>
              </div>
              <ArrowUpRight size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Update Stock Action */}
            <button 
              onClick={() => setActiveTab('products')} 
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-705 text-white rounded-2xl shadow-sm hover:shadow-orange-100 hover:shadow-md dark:shadow-none hover:-translate-y-0.5 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Layers size={14} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">Update Stock</span>
                  <span className="text-[9px] text-orange-100 block mt-0.5">Adjust warehouse stock counts</span>
                </div>
              </div>
              <ArrowUpRight size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* View Reports Action */}
            <button 
              onClick={() => setActiveTab('reports')} 
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-705 text-white rounded-2xl shadow-sm hover:shadow-sky-100 hover:shadow-md dark:shadow-none hover:-translate-y-0.5 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <FileText size={14} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">View Report</span>
                  <span className="text-[9px] text-sky-100 block mt-0.5">Check audit ledger statements</span>
                </div>
              </div>
              <ArrowUpRight size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="text-[9px] text-slate-400 text-center uppercase tracking-wider font-bold">
            SK Powertech Management Console
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardView;
