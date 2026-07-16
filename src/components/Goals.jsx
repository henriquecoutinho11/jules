import React, { useState } from 'react';
import { Target, Plus, Check, Trash2, TrendingUp, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Goals({ data, onUpdate }) {
  const goals = data.goals || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState(null);

  // Goal Form State
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Investimentos');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('');

  // Add new goal
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!title || !target || Number(target) <= 0) {
      alert("Por favor, preencha o título e o valor alvo com dados válidos.");
      return;
    }

    const newGoal = {
      id: `g-${Date.now()}`,
      title,
      target: parseFloat(target),
      current: parseFloat(current) || 0,
      deadline,
      category
    };

    onUpdate({
      ...data,
      goals: [...goals, newGoal]
    });

    setIsModalOpen(false);
    setTitle('');
    setTarget('');
    setCurrent('0');
    setDeadline('');
  };

  // Delete dynamic goal
  const handleDeleteGoal = (id) => {
    if (window.confirm("Deseja mesmo remover esta meta de economia?")) {
      onUpdate({
        ...data,
        goals: goals.filter(g => g.id !== id)
      });
    }
  };

  // Deposit directly into goal current balance
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(depositAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Por favor, digite um valor de depósito válido.");
      return;
    }

    const updatedGoals = goals.map(g => {
      if (g.id === depositGoalId) {
        return {
          ...g,
          current: Number((g.current + amountVal).toFixed(2))
        };
      }
      return g;
    });

    // Create a transaction as a dynamic expense to trigger budgets, or just save the goal current state
    // Let's create an automatic dynamic transaction under 'Investimentos' to deduct from user balance
    const targetGoal = goals.find(g => g.id === depositGoalId);
    const newTransaction = {
      id: `t-${Date.now()}`,
      description: `Aporte: ${targetGoal.title}`,
      amount: amountVal,
      type: 'despesa',
      category: 'Outros', // Fallback or Investimentos
      date: new Date().toISOString().split('T')[0]
    };

    onUpdate({
      ...data,
      goals: updatedGoals,
      transactions: [...data.transactions, newTransaction]
    });

    setDepositGoalId(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Metas Financeiras</h2>
          <p className="text-slate-500">Defina objetivos de economia e economize com disciplina</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Criar Nova Meta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((g) => {
          const progressPercent = Math.min(Math.round((g.current / g.target) * 100), 100);
          const isFinished = g.current >= g.target;

          return (
            <div
              key={g.id}
              className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-5 relative overflow-hidden transition-all hover:shadow-md ${isFinished ? 'ring-2 ring-emerald-500/20' : ''}`}
            >
              {/* Top Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
                    <Target className="w-5 h-5 text-primary-600" />
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-snug">{g.title}</h3>
                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-medium">
                    {g.category || 'Objetivos'}
                  </span>
                </div>
              </div>

              {/* Progress and Values */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-800 text-lg">{formatCurrency(g.current)}</span>
                  <span className="text-slate-400 text-xs">
                    alvo <span className="font-semibold text-slate-700">{formatCurrency(g.target)}</span>
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-semibold text-primary-600">{progressPercent}% Concluído</span>
                  {g.deadline && (
                    <span>Meta: {formatDate(g.deadline)}</span>
                  )}
                </div>
              </div>

              {/* Deposit Quick Trigger Form */}
              {depositGoalId === g.id ? (
                <form onSubmit={handleDepositSubmit} className="pt-2 flex items-center gap-2">
                  <input
                    type="number"
                    step="5"
                    min="1"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="R$ Aporte"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositGoalId(null)}
                    className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  disabled={isFinished}
                  onClick={() => setDepositGoalId(g.id)}
                  className={`w-full py-2.5 font-semibold text-xs rounded-xl transition-all border flex items-center justify-center gap-1 ${isFinished ? 'bg-emerald-50 text-emerald-700 border-emerald-100 cursor-not-allowed' : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border-primary-100'}`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isFinished ? 'Objetivo Alcançado 🎉' : 'Adicionar Economia'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Goal creation Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Nova Meta Financeira</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Título da Meta
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Minha Reserva Financeira"
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Valor Alvo (R$)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="5000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Valor Atual (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Prazo Limite
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-colors border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
