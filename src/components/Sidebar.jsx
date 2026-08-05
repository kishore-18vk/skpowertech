import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import logo from '../assets/logo.jpeg';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  FileBarChart,
  Users,
  Layers,
  FileText,
  Wrench,
  UserCheck,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Wallet
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { activeTab, setActiveTab, darkMode, setDarkMode, alerts, logout } = useContext(AppContext);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-500' },
    { id: 'products', name: 'Products', icon: Package, color: 'text-emerald-500' },
    { id: 'purchases', name: 'Purchase Entry', icon: ShoppingBag, color: 'text-amber-500' },
    { id: 'sales', name: 'Sales Entry', icon: ShoppingCart, color: 'text-sky-500' },
    { id: 'reports', name: 'Sales Reports', icon: FileBarChart, color: 'text-orange-500' },
    { id: 'expenses', name: 'Expenses', icon: Wallet, color: 'text-purple-500' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 
        transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen no-print
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand/Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <img src={logo} alt="SK Powertech Logo" className="w-9 h-9 object-contain bg-white p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm" />
            <div>
              <span className="font-display font-bold text-base leading-none text-slate-800 dark:text-white block">S.K. Power Tech</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">ERP Manager</span>
            </div>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden text-slate-500"
            onClick={toggleSidebar}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isOpen) toggleSidebar();
                }}
                className={`
                  flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 group
                  ${isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={`transition-transform duration-150 group-hover:scale-110 ${item.color}`} />
                  <span className="font-display font-medium">{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`
                    px-2 py-0.5 text-[10px] font-bold rounded-full
                    ${item.id === 'inventory' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme Settings & Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              {darkMode ? (
                <>
                  <Sun size={18} className="text-amber-500" />
                  <span className="font-display">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="text-indigo-600" />
                  <span className="font-display">Dark Mode</span>
                </>
              )}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {darkMode ? 'DARK' : 'LIGHT'}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center justify-between w-full px-4 py-2.5 mt-2 text-sm font-semibold text-rose-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-150"
          >
            <div className="flex items-center space-x-3">
              <LogOut size={18} className="text-rose-500" />
              <span className="font-display">Log Out</span>
            </div>
          </button>

          {/* System Date stamp */}
          <div className="mt-4 px-4 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider block">System Date</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mt-0.5">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
