import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import NotificationPanel from './NotificationPanel';
import { Bell, Menu, Calendar, LogOut } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const Header = ({ toggleSidebar }) => {
  const { alerts, logout } = useContext(AppContext);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print transition-all duration-200">
      {/* Mobile Toggle & Logo / Company Name */}
      <div className="flex items-center space-x-3">
        <button 
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden text-slate-500 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center space-x-2.5">
          {/* Company Logo */}
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-amber-500 text-white font-black text-xs shadow-sm">
            SK
          </div>
          {/* Company Name */}
          <span className="font-display font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
            SK Powertech
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Current Date */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-350 shadow-sm">
          <Calendar size={13} className="text-slate-400" />
          <span>{formatDate("2026-07-11")}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            className={`
              p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all relative
              ${isNotifOpen ? 'bg-slate-50 dark:bg-slate-800' : ''}
            `}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 text-[9px] font-extrabold flex items-center justify-center bg-rose-500 text-white rounded-full border-2 border-white dark:border-slate-900 animate-bounce">
                {alerts.length}
              </span>
            )}
          </button>

          <NotificationPanel 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
          />
        </div>

        {/* Profile Icon */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30">
            AD
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">Admin</span>
            <span className="text-[9px] text-slate-400 block leading-none">SK Manager</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Logout"
          className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
