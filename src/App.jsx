import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ArrowRightLeft, Target, Settings as SettingsIcon, Wallet, PiggyBank } from 'lucide-react';
import { loadData, saveData } from './utils/formatters';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Goals from './components/Goals';
import Settings from './components/Settings';

export default function App() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('painel');

  // Load finance database from localStorage
  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
  }, []);

  // Handler to persist edited state
  const handleDataUpdate = (newData) => {
    setData(newData);
    saveData(newData);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-sm font-semibold text-slate-500">Carregando seus dados...</span>
        </div>
      </div>
    );
  }

  // Navigation Links
  const menuItems = [
    { id: 'painel', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'transações', label: 'Transações', icon: ArrowRightLeft },
    { id: 'orçamentos', label: 'Orçamentos', icon: Wallet },
    { id: 'metas', label: 'Metas', icon: PiggyBank },
    { id: 'configurações', label: 'Configurações', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Beautiful Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 text-white p-2 rounded-xl shadow-md shadow-primary-500/20">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">OrganizaFin</h1>
              <span className="text-xs text-primary-600 font-bold tracking-wider uppercase">Finanças Pessoais</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Nuvem Conectada</span>
          </div>
        </div>
      </header>

      {/* Main Responsive Body Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Responsive Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Inner Tab Component Rendering */}
        <main className="flex-1 bg-transparent">
          {activeTab === 'painel' && <Dashboard data={data} setActiveTab={setActiveTab} />}
          {activeTab === 'transações' && <Transactions data={data} onUpdate={handleDataUpdate} />}
          {activeTab === 'orçamentos' && <Budgets data={data} onUpdate={handleDataUpdate} />}
          {activeTab === 'metas' && <Goals data={data} onUpdate={handleDataUpdate} />}
          {activeTab === 'configurações' && <Settings data={data} onUpdate={handleDataUpdate} />}
        </main>
      </div>
    </div>
  );
}
