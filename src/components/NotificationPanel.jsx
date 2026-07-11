import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertCircle, AlertTriangle, Info, Bell, BellOff, X } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { alerts, setActiveTab } = useContext(AppContext);

  if (!isOpen) return null;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case 'danger':
        return 'border-rose-100 bg-rose-50/50 dark:border-rose-950/20 dark:bg-rose-950/5';
      case 'warning':
        return 'border-amber-100 bg-amber-50/50 dark:border-amber-950/20 dark:bg-amber-950/5';
      case 'info':
      default:
        return 'border-sky-100 bg-sky-50/50 dark:border-sky-950/20 dark:bg-sky-950/5';
    }
  };

  const handleAlertClick = (tab) => {
    if (tab) {
      setActiveTab(tab);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      
      {/* Panel */}
      <div className="absolute right-0 mt-2.5 w-80 sm:w-96 max-h-[480px] z-50 overflow-hidden flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Bell size={16} className="text-indigo-500" />
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white">Alert Notifications</h4>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
            {alerts.length} Warnings
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[360px]">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <BellOff className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">All systems operational</p>
              <p className="text-[10px] text-slate-400 mt-0.5">No stock, service, or warranty alerts detected.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => handleAlertClick(alert.linkTab)}
                className={`
                  flex items-start space-x-3 w-full p-2.5 text-left border rounded-xl transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/40
                  ${getAlertStyle(alert.type)}
                `}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      {alert.category}
                    </span>
                  </div>
                  <h5 className="font-display font-semibold text-xs text-slate-800 dark:text-slate-200 mt-0.5">
                    {alert.title}
                  </h5>
                  <p className="text-[11px] leading-normal text-slate-500 dark:text-slate-400 mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {alerts.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Click warning cards to navigate and fix issues.
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
