import React, { useState } from 'react';
import { Plus, Check, Edit2, AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Budgets({ data, onUpdate }) {
  const budgets = data.budgets || [];
  const [editingCategory, setEditingCategory] = useState(null);
  const [newLimit, setNewLimit] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customLimit, setCustomLimit] = useState('');

  // Handle Edit Limit Trigger
  const startEdit = (b) => {
    setEditingCategory(b.category);
    setNewLimit(b.limit.toString());
  };

  // Handle Save Limit
  const saveLimit = (category) => {
    const limitVal = parseFloat(newLimit);
    if (isNaN(limitVal) || limitVal < 0) {
      alert("Por favor, digite um limite numérico válido superior ou igual a zero.");
      return;
    }

    const updatedBudgets = budgets.map((b) =>
      b.category === category ? { ...b, limit: limitVal } : b
    );

    onUpdate({
      ...data,
      budgets: updatedBudgets
    });

    setEditingCategory(null);
  };

  // Handle Add New Budget Category
  const handleAddBudget = (e) => {
    e.preventDefault();
    const categoryName = customCategory.trim();
    const limitVal = parseFloat(customLimit);

    if (!categoryName) {
      alert("Por favor, informe a categoria.");
      return;
    }
    if (isNaN(limitVal) || limitVal < 0) {
      alert("Por favor, informe um limite válido igual ou superior a zero.");
      return;
    }

    if (budgets.some(b => b.category.toLowerCase() === categoryName.toLowerCase())) {
      alert("Já existe um orçamento para esta categoria.");
      return;
    }

    // Calculate spent if transactions already exist for this category
    const categorySpent = (data.transactions || [])
      .filter(t => t.type === 'despesa' && t.category.toLowerCase() === categoryName.toLowerCase())
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const newBudget = {
      category: categoryName,
      limit: limitVal,
      spent: Number(categorySpent.toFixed(2))
    };

    onUpdate({
      ...data,
      budgets: [...budgets, newBudget]
    });

    setIsAddModalOpen(false);
    setCustomCategory('');
    setCustomLimit('');
  };

  // Handle Delete Budget Category
  const handleDeleteBudget = (category) => {
    if (window.confirm(`Deseja remover o orçamento da categoria "${category}"?`)) {
      onUpdate({
        ...data,
        budgets: budgets.filter(b => b.category !== category)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Orçamentos Planejados</h2>
          <p className="text-slate-500">Planeje e acompanhe os seus limites de gastos por categoria de despesas</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b) => {
          const progress = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
          const isExceeded = b.spent > b.limit;
          const isWarning = b.spent >= b.limit * 0.8 && b.spent <= b.limit;

          // Progress bar color matching status
          let progressColor = "bg-primary-500"; // Safe (Green)
          let cardBorder = "border-slate-100";
          let badgeText = "text-emerald-700 bg-emerald-50";
          let badgeMessage = "Dentro do planejado";

          if (isExceeded) {
            progressColor = "bg-red-500";
            cardBorder = "border-red-100";
            badgeText = "text-red-700 bg-red-50";
            badgeMessage = "Limite estourado!";
          } else if (isWarning) {
            progressColor = "bg-amber-500";
            cardBorder = "border-amber-100";
            badgeText = "text-amber-700 bg-amber-50";
            badgeMessage = "Atenção: Limite próximo";
          }

          return (
            <div
              key={b.category}
              className={`bg-white p-6 rounded-2xl border ${cardBorder} shadow-sm space-y-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{b.category}</h3>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ${badgeText}`}>
                    {badgeMessage}
                  </span>
                </div>

                {/* Dynamic Inline Edit Mode */}
                <div className="flex items-center gap-1">
                  {editingCategory === b.category ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="10"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        className="w-24 px-2 py-1 text-sm font-bold border border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      />
                      <button
                        onClick={() => saveLimit(b.category)}
                        className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        title="Salvar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(b)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                        title="Ajustar Limite"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(b.category)}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                        title="Excluir Orçamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Display */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-slate-800 text-base">{formatCurrency(b.spent)}</span>
                  <span className="text-slate-400 text-xs">
                    de limite <span className="font-bold text-slate-600">{formatCurrency(b.limit)}</span>
                  </span>
                </div>

                {/* Progress bar visual container */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`${progressColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Consumido: {Math.round(progress)}%</span>
                  {b.limit > 0 && (
                    <span>Disponível: {formatCurrency(Math.max(0, b.limit - b.spent))}</span>
                  )}
                </div>
              </div>

              {/* Warnings details */}
              {isExceeded && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50/55 p-2 rounded-lg font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Você ultrapassou o orçamento em {formatCurrency(b.spent - b.limit)}!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Budget Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Novo Orçamento de Categoria</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Ex: Vestuário, Pet Shop, Viagens"
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Limite Mensal (R$)
                </label>
                <input
                  type="number"
                  step="10"
                  min="0"
                  required
                  value={customLimit}
                  onChange={(e) => setCustomLimit(e.target.value)}
                  placeholder="500"
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm font-bold transition-all focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-colors border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Salvar Orçamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
