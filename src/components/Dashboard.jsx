import React from 'react';
import { TrendingUp, TrendingDown, Wallet, AlertCircle, Calendar, ArrowRightLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Dashboard({ data, setActiveTab }) {
  const transactions = data.transactions || [];
  const budgets = data.budgets || [];
  const goals = data.goals || [];

  // KPI Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'receita')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Pie chart calculation
  const expenseByCategory = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const totalExpensesSum = Object.values(expenseByCategory).reduce((a, b) => a + b, 0) || 1;

  // Custom Colors map for Visuals
  const categoryColors = {
    "Alimentação": "#ef4444", // Red
    "Moradia": "#f97316", // Orange
    "Transporte": "#eab308", // Yellow
    "Lazer": "#a855f7", // Purple
    "Saúde": "#06b6d4", // Cyan
    "Educação": "#3b82f6", // Blue
    "Outros": "#64748b" // Slate
  };

  // Recent transactions (last 5)
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Critical Budgets warning
  const criticalBudgets = budgets.filter(b => {
    const progress = (b.spent / b.limit) * 100;
    return progress >= 80;
  });

  // Calculate SVG circle for doughnut chart
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const categoriesEntries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Dynamic Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500">Acompanhe e otimize a sua saúde financeira pessoal</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>Hoje é {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5">
            <Wallet className="w-32 h-32 text-slate-900" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Saldo Geral</span>
            <div className={`p-2 rounded-lg ${netBalance >= 0 ? 'bg-primary-50 text-primary-600' : 'bg-red-50 text-red-600'}`}>
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className={`text-3xl font-bold tracking-tight ${netBalance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
            {formatCurrency(netBalance)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Diferença entre receitas e despesas acumuladas</p>
        </div>

        {/* Income Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5">
            <TrendingUp className="w-32 h-32 text-primary-500" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Total Receitas</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">
            {formatCurrency(totalIncome)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Ganhos no período</p>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5">
            <TrendingDown className="w-32 h-32 text-red-500" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Total Despesas</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">
            {formatCurrency(totalExpense)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Saídas e gastos correntes</p>
        </div>
      </div>

      {/* Warnings & Active Budgets Alerts */}
      {criticalBudgets.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Atenção! Limite de Orçamento Próximo ou Excedido</h4>
            <p className="text-xs text-amber-700 mt-1">
              Você atingiu 80% ou mais do orçamento planejado nas seguintes categorias:{" "}
              {criticalBudgets.map(b => `${b.category} (${Math.round((b.spent/b.limit)*100)}%)`).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Visual Charts & Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut SVG Chart representing category distributions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribuição de Despesas</h3>

          {categoriesEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
              <TrendingDown className="w-12 h-12 stroke-1 mb-2" />
              Nenhuma despesa registrada para exibir no gráfico.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              {/* Doughnut SVG */}
              <div className="relative flex justify-center">
                <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-40 h-40 transform -rotate-90">
                  {categoriesEntries.map(([category, amount]) => {
                    const percentage = amount / totalExpensesSum;
                    const startX = Math.cos(2 * Math.PI * cumulativePercent);
                    const startY = Math.sin(2 * Math.PI * cumulativePercent);
                    cumulativePercent += percentage;
                    const endX = Math.cos(2 * Math.PI * cumulativePercent);
                    const endY = Math.sin(2 * Math.PI * cumulativePercent);

                    const largeArcFlag = percentage > 0.5 ? 1 : 0;

                    // Draw path
                    return (
                      <path
                        key={category}
                        d={`M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                        fill={categoryColors[category] || '#ccc'}
                        className="transition-all hover:opacity-90 duration-300"
                        title={`${category}: ${formatCurrency(amount)}`}
                      />
                    );
                  })}
                  {/* Inner cutout to make it a donut */}
                  <circle cx="0" cy="0" r="0.5" fill="white" />
                </svg>
                {/* Center text details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total</span>
                  <span className="text-sm font-bold text-slate-700">{formatCurrency(totalExpense)}</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2.5">
                {categoriesEntries.map(([category, amount]) => {
                  const pct = ((amount / totalExpensesSum) * 100).toFixed(1);
                  return (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoryColors[category] || '#ccc' }}
                        />
                        <span className="text-slate-600 font-medium">{category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-800 font-bold">{formatCurrency(amount)}</span>
                        <span className="text-xs text-slate-400 block">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Goals Progress quick view */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Metas de Economia</h3>
            <div className="space-y-4">
              {goals.slice(0, 3).map((g) => {
                const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
                return (
                  <div key={g.id} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{g.title}</span>
                      <span className="text-slate-500 font-medium">
                        {formatCurrency(g.current)} / <span className="text-xs text-slate-400">{formatCurrency(g.target)}</span>
                      </span>
                    </div>
                    {/* Beautiful progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-primary-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Progresso: {pct}%</span>
                      <span>Até {formatDate(g.deadline)}</span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm">
                  Nenhuma meta financeira definida.
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('metas')}
            className="w-full mt-6 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <span>Gerenciar todas as Metas</span>
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent transactions log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Últimas Transações</h3>
          <button
            onClick={() => setActiveTab('transações')}
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1"
          >
            Ver todas <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold">
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{t.description}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(t.date)}</td>
                  <td className={`py-3.5 px-4 text-right font-bold ${t.type === 'receita' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
              {sortedTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-slate-400 text-sm">
                    Nenhuma transação registrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
