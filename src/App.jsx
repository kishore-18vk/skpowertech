import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginView from './components/LoginView';

// Import Tab Views
import DashboardView from './components/DashboardView';
import InventoryPage from './components/InventoryPage';
import SalesView from './components/SalesView';
import ReportsView from './components/ReportsView';
import ExpensesView from './components/ExpensesView';

function DashboardShell() {
  const { activeTab, auth, login } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protect Dashboard Shell behind login view
  if (!auth?.isAuthenticated) {
    return <LoginView onLogin={login} />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <InventoryPage />;
      case 'sales':
        return <SalesView />;
      case 'reports':
        return <ReportsView />;
      case 'expenses':
        return <ExpensesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content viewport area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto h-full">
            {renderActiveView()}
          </div>
        </main>

      </div>

    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <DashboardShell />
    </AppProvider>
  );
}

export default App;
